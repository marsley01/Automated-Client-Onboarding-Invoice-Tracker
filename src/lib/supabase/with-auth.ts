import {
  withSupabase as _withSupabase,
  createSupabaseContext as _createSupabaseContext,
} from "@supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

type AnyClient = SupabaseClient<any>;
export type Ctx = {
  supabase: AnyClient;
  supabaseAdmin: AnyClient;
  userClaims: { id: string; role?: string; email?: string; appMetadata?: any; userMetadata?: any } | null;
  jwtClaims: Record<string, any> | null;
  authMode: string;
};

function asAny(ctx: any): Ctx {
  return {
    supabase: ctx.supabase as AnyClient,
    supabaseAdmin: ctx.supabaseAdmin as AnyClient,
    userClaims: ctx.userClaims,
    jwtClaims: ctx.jwtClaims,
    authMode: ctx.authMode,
  };
}

export function createSupabaseContext(request: Request, opts?: any) {
  return _createSupabaseContext(request, opts).then((r: any) => {
    if (r.error) return r;
    return { data: asAny(r.data), error: null };
  });
}

export function withSupabase(config: any, handler: (req: Request, ctx: Ctx) => Promise<Response>) {
  return _withSupabase(config, async (req: Request, ctx: any) => {
    return handler(req, asAny(ctx));
  });
}
