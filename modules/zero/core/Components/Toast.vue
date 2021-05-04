<template>
  <div :class="['toast', category]">

    <div class="panel-top">

      <div class="icon">
        <IconCheckmark
          v-if="category === 'success'"
          fill="white" />
        <IconCaution
          v-if="category === 'caution' || category === 'error'"
          fill="white" />
      </div>

      <div class="message">
        {{ message }}
      </div>

    </div>

    <div v-if="submessages" class="submessages">
      <div
        v-for="(submessage, index) in submessages"
        :key="index"
        class="submessage">
        {{ submessage }}
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import Config from '@/nuxt.config'

import IconCheckmark from '@/modules/zero/core/Components/Icons/Checkmark'
import IconCaution from '@/modules/zero/core/Components/Icons/Caution'

// ====================================================================== Export
export default {
  name: 'Toast',

  components: {
    IconCheckmark,
    IconCaution
  },

  props: {
    toast: {
      type: Object,
      required: true
    }
  },

  computed: {
    id () {
      return this.toast.id
    },
    category () {
      return this.toast.category
    },
    message () {
      return this.toast.message
    },
    submessages () {
      return this.toast.submessages
    },
    timeout () {
      return Config.toaster.timeout || 5000
    }
  },

  mounted () {
    const timeout = setTimeout(() => {
      this.$Toaster.removeToast(this.id)
      clearTimeout(timeout)
    }, this.timeout)
  }
}
</script>

<style lang="scss" scoped>
$toastSuccess: green;
$toastCaution: darkorange;
$toastError: red;

// ///////////////////////////////////////////////////////////////////// General
.toast {
  @include shadow1;
  width: 30rem;
  min-height: 3rem;
  color: black;
  background-color: white;
  border-radius: 0.25rem;
  padding: 1rem 2rem;
  overflow: hidden;
  @include customMaxMQ (32rem) {
    width: 100%;
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.panel-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.icon {
  margin-right: 1rem;
  @include customMaxMQ (32rem) {
    display: none;
  }
  .caution-svg-icon {
    width: 1.125rem;
  }
  .checkmark-svg-icon {
    width: 1rem;
  }
}

// ///////////////////////////////////////////////////////////////////// Message
.message {
  font-size: inherit;
  line-height: 1;
  text-align: center;
}

.submessages {
  margin-top: 1rem;
}

.submessage {
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  color: $mineShaft;
  text-align: center;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}
</style>
