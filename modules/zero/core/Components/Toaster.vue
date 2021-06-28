<template>
  <div v-if="messages" class="toaster">

    <template v-for="toast in toasts">
      <Toast
        v-if="toast"
        :key="toast.id"
        :toast="toast" />
    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Cookie from 'cookie'

import Toast from '@/modules/zero/core/Components/Toast'

// ====================================================================== Export
export default {
  name: 'Toaster',

  components: {
    Toast
  },

  computed: {
    ...mapGetters({
      messages: 'core/messages'
    }),
    toasts () {
      const toasts = this.messages.filter((message) => {
        if (message && message.type === 'toast') { return message }
        return false
      })
      if (toasts.length > 0) { return toasts.reverse() }
      return false
    }
  },

  mounted () {
    const cookie = this.$GetCookie(document.cookie, 'toast')
    if (cookie) {
      this.$Toaster.addToast(JSON.parse(cookie))
      document.cookie = Cookie.serialize('toast', 'expired', { path: '/', maxAge: 0, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') })
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 1rem;

// ///////////////////////////////////////////////////////////////////// General
.toaster {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 50%;
  padding-top: $padding;
  transform: translateX(-50%);
  z-index: 100000;
  @include customMaxMQ (32rem) {
    left: 0;
    width: 100%;
    padding: $padding;
    padding-bottom: 0;
    transform: none;
  }
}
</style>
