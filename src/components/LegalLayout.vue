<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'

import { renderLegalDoc } from '@/lib/legal'

const props = defineProps<{
  slug: 'privacy' | 'terms'
}>()

const { locale, t } = useI18n()

const doc = computed(() => renderLegalDoc(props.slug, locale.value))
const showNotice = computed(() => !['zh', 'en'].includes(locale.value))
const langLabel = computed(() =>
  doc.value.lang === 'zh' ? t('legal.chinese') : t('legal.english'),
)
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16 lg:px-8">
    <router-link
      to="/"
      class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft class="size-4" />
      {{ t('legal.backHome') }}
    </router-link>

    <p
      v-if="showNotice"
      class="mt-6 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
    >
      {{ t('legal.notAvailable', { lang: langLabel }) }}
    </p>

    <article class="legal-prose mt-8" v-html="doc.html" />
  </div>
</template>

<style scoped>
.legal-prose :deep(h1) {
  font-size: 1.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.legal-prose :deep(h2) {
  margin-top: 2.25rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.legal-prose :deep(p) {
  margin-top: 1rem;
  line-height: 1.75;
  color: var(--foreground);
}

.legal-prose :deep(ul) {
  margin-top: 1rem;
  padding-inline-start: 1.25rem;
  list-style: disc;
}

.legal-prose :deep(li) {
  margin-top: 0.5rem;
  line-height: 1.7;
}

.legal-prose :deep(a) {
  color: var(--primary);
  text-underline-offset: 2px;
  text-decoration: underline;
}

.legal-prose :deep(strong) {
  font-weight: 600;
}
</style>
