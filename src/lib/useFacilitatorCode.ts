import { useState, useCallback } from 'react';
import { supabase } from './supabase';

export function useFacilitatorCode() {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCode = useCallback(
    async (code: string, codeType: string): Promise<boolean> => {
      setVerifying(true);
      setError(null);

      const normalized = code.trim().toUpperCase();

      const { data, error: queryError } = await supabase
        .from('facilitator_codes')
        .select('id, code, code_type')
        .eq('code', normalized)
        .eq('code_type', codeType)
        .eq('is_active', true)
        .maybeSingle();

      setVerifying(false);

      if (queryError) {
        setError(queryError.message);
        return false;
      }

      if (!data) {
        setError('Invalid approval code. Please check with the facilitator.');
        return false;
      }

      return true;
    },
    []
  );

  return { verifying, error, verifyCode, setError };
}
