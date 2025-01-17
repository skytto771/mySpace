import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

export * from '@/stores/modules/user'
export * from '@/stores/modules/chat'
export * from '@/stores/modules/note'
export * from '@/stores/modules/talk'
export * from '@/stores/modules/album'
export * from '@/stores/modules/work'
export * from '@/stores/modules/weather'
