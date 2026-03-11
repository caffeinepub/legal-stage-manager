import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Case, EnforcementRecord, LitigationRecord } from "../backend.d";
import {
  sampleCases,
  sampleEnforcement,
  sampleLitigation,
  sampleNotices,
} from "../data/sampleData";
import { useActor } from "./useActor";

const SEED_KEY = "klp_seeded_v1";

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
