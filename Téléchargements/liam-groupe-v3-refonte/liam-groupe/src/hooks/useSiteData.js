import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'
import {
  siteInfo as fallbackSiteInfo,
  navLinks as fallbackNavLinks,
  domains as fallbackDomains,
  homeHeroImages as fallbackHomeHeroImages,
  events as fallbackEvents,
  news as fallbackNews,
  team as fallbackTeam,
  partners as fallbackPartners,
  testimonials as fallbackTestimonials,
  footerLinks as fallbackFooterLinks,
  img,
} from '../data/siteData.js'

const STALE_TIME = 5 * 60 * 1000

async function fetchSetting(key, fallback) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  return error ? fallback : data.value
}

async function fetchAll(table, fallback) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('order_index')
  if (error || !data || data.length === 0) return fallback
  return data
}

export function useSiteInfo() {
  return useQuery({
    queryKey: ['siteInfo'],
    queryFn: () => fetchSetting('siteInfo', fallbackSiteInfo),
    staleTime: STALE_TIME,
  })
}

export function useNavLinks() {
  return useQuery({
    queryKey: ['navLinks'],
    queryFn: () => fetchSetting('navLinks', fallbackNavLinks),
    staleTime: STALE_TIME,
  })
}

export function useDomains() {
  return useQuery({
    queryKey: ['domains'],
    queryFn: () => fetchAll('domains', fallbackDomains),
    staleTime: STALE_TIME,
  })
}

export function useDomain(slug) {
  return useQuery({
    queryKey: ['domain', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('slug', slug)
        .single()
      return error ? fallbackDomains.find((d) => d.slug === slug) || null : data
    },
    staleTime: STALE_TIME,
  })
}

export function useHomeHeroImages() {
  return useQuery({
    queryKey: ['homeHeroImages'],
    queryFn: () => fetchSetting('homeHeroImages', fallbackHomeHeroImages),
    staleTime: STALE_TIME,
  })
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchAll('events', fallbackEvents),
    staleTime: STALE_TIME,
  })
}

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => fetchAll('news', fallbackNews),
    staleTime: STALE_TIME,
  })
}

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: () => fetchAll('team', fallbackTeam),
    staleTime: STALE_TIME,
  })
}

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: () => fetchAll('partners', fallbackPartners),
    staleTime: STALE_TIME,
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => fetchAll('testimonials', fallbackTestimonials),
    staleTime: STALE_TIME,
  })
}

export function useFooterLinks() {
  return useQuery({
    queryKey: ['footerLinks'],
    queryFn: () => fetchSetting('footerLinks', fallbackFooterLinks),
    staleTime: STALE_TIME,
  })
}

export { img }
