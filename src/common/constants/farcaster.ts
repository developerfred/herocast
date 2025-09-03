import type { FarcasterEmbed } from '@mod-protocol/farcaster';
import { UUID } from 'crypto';

export type ParentCastIdType = {
  fid: number;
  hash: Uint8Array;
};

export enum DraftStatus {
  writing = 'writing',
  scheduled = 'scheduled',
  publishing = 'publishing',
  published = 'published',
  removed = 'removed',
  failed = 'failed',
}

export type DraftType = {
  id: UUID;
  text: string;
  status: DraftStatus;
  createdAt: number;
  mentionsToFids?: { [key: string]: string };
  castType?: CastTypeEnum;
  embeds?: FarcasterEmbed[];
  parentUrl?: string;
  parentCastId?: ParentCastIdType;
  accountId?: UUID;
  timestamp?: string;
  hash?: string;
};

// drafttype without createdAt
export type DraftTemplateType = Omit<DraftType, 'createdAt'>;

export type AuthorType = {
  fid: string;
  username: string;
  display_name?: string;
  displayName?: string;
  pfp_url?: string;
  pfp: {
    url: string;
  };
};

export type EmbedType = {
  url: string;
};

export enum CastReactionType {
  likes = 'likes',
  recasts = 'recasts',
  replies = 'replies',
  quote = 'quote',
  links = 'links',
}

export type CastReactionsType = {
  CastReactionType?: { fid: number }[];
  recasts?: { fid: number }[];
  likes?: { fid: number }[];
  count?: number;
  fids?: number[];
};

export enum CastTypeEnum {
  CAST = 'cast',
  LONG_CAST = 'long_cast'
}

export type CastType = {
  author: AuthorType;
  hash: string;
  parent_author: AuthorType | { fid?: string } | null;
  parentHash: string | null;
  parent_hash: string | null;
  parent_url: string | null;
  reactions: CastReactionsType;
  text: string;
  thread_hash: string | null;
  timestamp: string;
  embeds: EmbedType[];
  replies?: { count: number };
  recasts?: { fids: number[]; count: number };
  type?: CastTypeEnum;
};


export const CAST_TEXT_LIMITS = {
  SHORT_CAST_MAX_BYTES: 320,
  LONG_CAST_MAX_BYTES: 1024,
  PREVIEW_CHARS: 280
} as const;