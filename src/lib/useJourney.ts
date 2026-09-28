import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import type {
  Participant,
  ProgressMap,
  StationSlug,
  StationStatus,
} from './types';
import { STATION_ORDER, getCompletedCount } from './stations';

const PARTICIPANT_KEY = 'exhibition_participant_id';

export function useJourney() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const loadProgress = useCallback(async (participantId: string) => {
    const { data, error: queryError } = await supabase
      .from('station_progress')
      .select('*')
      .eq('participant_id', participantId);

    if (queryError) {
      setError(queryError.message);
      return;
    }

    const map: ProgressMap = {};
    for (const slug of STATION_ORDER) {
      const row = data?.find((r) => r.station_slug === slug);
      map[slug] = row ?? null;
    }
    setProgress(map);
  }, []);

  const loadParticipant = useCallback(
    async (id: string) => {
      const { data, error: queryError } = await supabase
        .from('participants')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (queryError || !data) {
        localStorage.removeItem(PARTICIPANT_KEY);
        setParticipant(null);
        setError(queryError?.message ?? 'Participant not found');
        return;
      }

      setParticipant(data as Participant);
      await loadProgress(data.id);
    },
    [loadProgress]
  );

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      const storedId = localStorage.getItem(PARTICIPANT_KEY);
      if (storedId) {
        await loadParticipant(storedId);
      }
      setLoading(false);
    })();
  }, [loadParticipant]);

  const createParticipant = useCallback(
    async (displayName?: string) => {
      const { data, error: insertError } = await supabase
        .from('participants')
        .insert({
          display_name: displayName?.trim() || null,
        })
        .select()
        .single();

      if (insertError || !data) {
        setError(insertError?.message ?? 'Failed to create participant');
        return null;
      }

      const newParticipant = data as Participant;
      localStorage.setItem(PARTICIPANT_KEY, newParticipant.id);
      setParticipant(newParticipant);
      setProgress({});
      return newParticipant;
    },
    []
  );

  const setStationStatus = useCallback(
    async (slug: StationSlug, status: StationStatus) => {
      if (!participant) return;

      const row: Record<string, unknown> = {
        participant_id: participant.id,
        station_slug: slug,
        status,
      };
      if (status === 'submitted') row.submitted_at = new Date().toISOString();
      if (status === 'approved') row.approved_at = new Date().toISOString();

      const { error: upsertError } = await supabase
        .from('station_progress')
        .upsert(row, { onConflict: 'participant_id,station_slug' });

      if (upsertError) {
        setError(upsertError.message);
        return false;
      }

      await loadProgress(participant.id);
      return true;
    },
    [participant, loadProgress]
  );

  const saveAnswers = useCallback(
    async (slug: StationSlug, answers: Record<string, string>) => {
      if (!participant) return false;

      const { error: upsertError } = await supabase
        .from('station_progress')
        .upsert(
          {
            participant_id: participant.id,
            station_slug: slug,
            status: 'in_progress',
            answers,
          },
          { onConflict: 'participant_id,station_slug' }
        );

      if (upsertError) {
        setError(upsertError.message);
        return false;
      }

      await loadProgress(participant.id);
      return true;
    },
    [participant, loadProgress]
  );

  const markCompleted = useCallback(async () => {
    if (!participant) return;
    const { error: updateError } = await supabase
      .from('participants')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', participant.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadParticipant(participant.id);
  }, [participant, loadParticipant]);

  const resetJourney = useCallback(() => {
    localStorage.removeItem(PARTICIPANT_KEY);
    setParticipant(null);
    setProgress({});
    setError(null);
  }, []);

  const completedCount = getCompletedCount(progress);
  const allComplete = completedCount === STATION_ORDER.length;

  return {
    participant,
    progress,
    loading,
    error,
    completedCount,
    allComplete,
    createParticipant,
    setStationStatus,
    saveAnswers,
    markCompleted,
    resetJourney,
  };
}

export type JourneyHook = ReturnType<typeof useJourney>;
