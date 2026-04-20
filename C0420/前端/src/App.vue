<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="isLoginPage" />
    <AppLayout v-else>
      <component :is="Component" />
    </AppLayout>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>
