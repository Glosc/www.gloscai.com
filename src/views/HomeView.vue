<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, ArrowUpRight, Github, Moon, Star, Sun } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { fetchOrgPublicRepos, type OrgRepo } from '@/lib/github'

const GITHUB_ORG = 'Glosc'

const { t } = useI18n()
const { theme, toggleTheme } = useTheme()
const { locale, setLocale, locales } = useLocale()

const repos = ref<OrgRepo[]>([])
const reposPending = ref(true)
const reposFailed = ref(false)

async function loadRepos() {
  try {
    repos.value = await fetchOrgPublicRepos(GITHUB_ORG)
  } catch (error) {
    console.error(error)
    reposFailed.value = true
  } finally {
    reposPending.value = false
  }
}

onMounted(loadRepos)

const capabilities = computed(() => [
  t('capabilities.item1'),
  t('capabilities.item2'),
  t('capabilities.item3'),
])
</script>

<template>
  <div>
    <header class="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <a href="#top" class="flex items-center gap-2.5 text-sm font-semibold tracking-wide">
          <img src="/favicon.ico" alt="Glosc AI" class="size-5 rounded" />
          {{ t('nav.brand') }}
        </a>

        <nav class="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#open-source" class="hover:text-foreground">{{ t('nav.openSource') }}</a>
          <router-link to="/privacy" class="hover:text-foreground">{{
            t('nav.privacy')
          }}</router-link>
          <router-link to="/terms" class="hover:text-foreground">{{ t('nav.terms') }}</router-link>
        </nav>

        <div class="flex items-center gap-2">
          <label class="relative">
            <span class="sr-only">{{ t('language.label') }}</span>
            <select
              :value="locale"
              class="h-9 cursor-pointer rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              @change="setLocale(($event.target as HTMLSelectElement).value as typeof locale)"
            >
              <option v-for="item in locales" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>
          </label>

          <Button variant="ghost" size="icon" :aria-label="t('theme.toggle')" @click="toggleTheme">
            <Sun v-if="theme === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>

          <Button
            as="a"
            :href="`https://github.com/${GITHUB_ORG}`"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="icon"
            :aria-label="t('nav.brand') + ' GitHub'"
          >
            <Github class="size-4" />
          </Button>
        </div>
      </div>
    </header>

    <section id="top" class="mx-auto max-w-6xl px-6 py-24 lg:px-8">
      <div class="max-w-2xl">
        <h1 class="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {{ t('hero.title1') }}
          <span class="text-primary">{{ t('hero.title2') }}</span>
        </h1>

        <p class="mt-6 text-lg leading-8 text-muted-foreground">
          {{ t('hero.description') }}
        </p>

        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button as="a" href="#open-source" size="lg" class="rounded-full px-7">
            {{ t('hero.ctaProducts') }}
            <ArrowRight class="size-4" />
          </Button>
          <Button
            as="a"
            :href="`https://github.com/${GITHUB_ORG}`"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="lg"
            class="rounded-full px-7"
          >
            {{ t('hero.ctaGithub') }}
            <ArrowUpRight class="size-4" />
          </Button>
        </div>

        <div class="mt-12 grid gap-3 sm:grid-cols-3">
          <div
            v-for="item in capabilities"
            :key="item"
            class="rounded-xl border border-border bg-card px-4 py-4 text-sm text-muted-foreground"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </section>

    <section id="open-source" class="border-t border-border">
      <div class="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          {{ t('openSource.eyebrow') }}
        </p>
        <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">{{ t('openSource.title') }}</h2>
        <p class="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {{ t('openSource.description') }}
        </p>

        <div v-if="reposPending" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="i in 6"
            :key="i"
            class="h-40 animate-pulse rounded-2xl border border-border bg-muted/60"
          />
        </div>

        <p
          v-else-if="reposFailed"
          class="mt-10 rounded-xl border border-border bg-muted/50 px-5 py-4 text-sm text-muted-foreground"
        >
          {{ t('openSource.error') }}
        </p>

        <p
          v-else-if="repos.length === 0"
          class="mt-10 rounded-xl border border-border bg-muted/50 px-5 py-4 text-sm text-muted-foreground"
        >
          {{ t('openSource.empty') }}
        </p>

        <div v-else class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="repo in repos"
            :key="repo.name"
            class="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-lg font-medium">{{ repo.name }}</h3>
              <span
                v-if="repo.stars > 0"
                class="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Star class="size-3.5" />
                {{ repo.stars }}
              </span>
            </div>

            <p class="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
              {{ repo.description || ' ' }}
            </p>

            <div class="mt-5 flex items-center gap-4 text-sm">
              <a
                :href="repo.homepage"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                {{ t('openSource.visit') }}
                <ArrowUpRight class="size-3.5" />
              </a>
              <a
                :href="repo.htmlUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Github class="size-3.5" />
                {{ t('openSource.viewRepo') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer id="footer" class="border-t border-border">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 text-sm text-muted-foreground lg:flex-row lg:items-end lg:justify-between lg:px-8"
      >
        <div>
          <p class="text-base font-medium text-foreground">{{ t('nav.brand') }}</p>
          <p class="mt-4">{{ t('footer.rights', { year: 2026 }) }}</p>
          <p class="mt-2">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"
              >沪ICP备2026003781号-1</a
            >
          </p>
          <p class="mt-2">
            <a
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011202022083"
              target="_blank"
              rel="noopener noreferrer"
              >沪公网安备31011202022083号</a
            >
          </p>
        </div>

        <div class="flex flex-wrap gap-6 text-sm">
          <a href="#top" class="hover:text-foreground">{{ t('footer.backToTop') }}</a>
          <a href="#open-source" class="hover:text-foreground">{{ t('footer.openSource') }}</a>
          <router-link to="/privacy" class="hover:text-foreground">{{
            t('footer.privacy')
          }}</router-link>
          <router-link to="/terms" class="hover:text-foreground">{{
            t('footer.terms')
          }}</router-link>
          <a
            :href="`https://github.com/${GITHUB_ORG}`"
            target="_blank"
            rel="noreferrer"
            class="hover:text-foreground"
          >
            {{ t('footer.github') }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
