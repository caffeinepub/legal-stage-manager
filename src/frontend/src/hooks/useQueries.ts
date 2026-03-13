import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Case, EnforcementRecord, LitigationRecord } from "../backend.d";
import {
  sampleCases,
  sampleEnforcement,
  sampleLitigation,
  sampleNotices,
} from "../data/sampleData";
import { useActor } from "./useActor";

const SEED_KEY = "klp_seeded_v2";

export function useSeedData() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["seed"],
    queryFn: async () => {
      if (!actor) return false;
      const alreadySeeded = localStorage.getItem(SEED_KEY);
      if (alreadySeeded) return true;

      const existing = await actor.getCases();
      if (existing.length > 0) {
        localStorage.setItem(SEED_KEY, "1");
        return true;
      }

      // Seed cases
      await Promise.all(sampleCases.map((c) => actor.addCase(c)));

      // Seed litigation
      await Promise.all(
        Object.entries(sampleLitigation).map(([caseId, lit]) =>
          actor.updateLitigation(caseId, lit),
        ),
      );

      // Seed enforcement
      await Promise.all(
        Object.entries(sampleEnforcement).map(([caseId, enf]) =>
          actor.updateEnforcement(caseId, enf),
        ),
      );

      localStorage.setItem(SEED_KEY, "1");
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      return true;
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetCases() {
  const { actor, isFetching } = useActor();
  return useQuery<Case[]>({
    queryKey: ["cases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCase(caseId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Case>({
    queryKey: ["case", caseId],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getCase(caseId);
    },
    enabled: !!actor && !isFetching && !!caseId,
  });
}

export function useGetLitigation(caseId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<LitigationRecord>({
    queryKey: ["litigation", caseId],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getLitigation(caseId);
    },
    enabled: !!actor && !isFetching && !!caseId,
  });
}

export function useGetEnforcement(caseId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<EnforcementRecord>({
    queryKey: ["enforcement", caseId],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getEnforcement(caseId);
    },
    enabled: !!actor && !isFetching && !!caseId,
  });
}

export function useGetNotices(caseId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notices", caseId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotices(caseId);
    },
    enabled: !!actor && !isFetching && !!caseId,
  });
}

export function useGetQueueEnrichment(caseIds: string[]) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["queue-enrichment", caseIds.join(",")],
    queryFn: async () => {
      if (!actor || caseIds.length === 0)
        return {
          litigation: {} as Record<string, LitigationRecord>,
          enforcement: {} as Record<string, EnforcementRecord>,
        };
      const [litResults, enfResults] = await Promise.all([
        Promise.allSettled(
          caseIds.map((id) => actor.getLitigation(id).then((r) => ({ id, r }))),
        ),
        Promise.allSettled(
          caseIds.map((id) =>
            actor.getEnforcement(id).then((r) => ({ id, r })),
          ),
        ),
      ]);
      const litigation: Record<string, LitigationRecord> = {};
      const enforcement: Record<string, EnforcementRecord> = {};
      for (const res of litResults) {
        if (res.status === "fulfilled" && res.value?.r)
          litigation[res.value.id] = res.value.r;
      }
      for (const res of enfResults) {
        if (res.status === "fulfilled" && res.value?.r)
          enforcement[res.value.id] = res.value.r;
      }
      return { litigation, enforcement };
    },
    enabled: !!actor && !isFetching && caseIds.length > 0,
  });
}

export function useAddCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCase: Case) => {
      if (!actor) throw new Error("No actor");
      return actor.addCase(newCase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}

export function useUpdateLitigation(caseId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: LitigationRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.updateLitigation(caseId, record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["litigation", caseId] });
    },
  });
}

export function useUpdateEnforcement(caseId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: EnforcementRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.updateEnforcement(caseId, record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enforcement", caseId] });
    },
  });
}
