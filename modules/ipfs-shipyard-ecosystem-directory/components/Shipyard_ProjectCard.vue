<template>
  <component
    :is="componentType"
    :to="navigateToProject"
    :href="primaryCta"
    :target="primaryCta ? '_blank' : null"
    tabindex="0"
    :class="['project-card', 'focus-visible', format]">
    <div class="card-inner-wrapper">

      <div class="thumbnail">
        <img :src="$relativity(`/images/projects/${logo}`)" :alt="imageAlt" />
      </div>

      <div class="content">
        <p class="title">
          {{ title }}
        </p>
        <p
          class="description"
          :data-tooltip="description.length >= 70 ? description : false"
          data-tooltip-theme="dark">
          {{ $truncateString(description, 70) }}
        </p>
      </div>

    </div>
  </component>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardProjectCard',

  props: {
    format: {
      type: String,
      default: 'block-view',
      required: false
    },
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    logo: {
      type: String,
      default: '',
      required: false
    },
    url: {
      type: String,
      default: '',
      required: false
    },
    navigationBehavior: {
      type: Number,
      default: 2,
      required: false
    },
    enableImageAlt: {
      type: Boolean,
      default: true,
      required: false
    }
  },

  computed: {
    componentType () {
      if (this.navigationBehavior === 0) {
        return 'div'
      } else if (this.navigationBehavior === 1) {
        return 'a'
      }
      return 'NuxtLink'
    },
    navigateToProject () {
      if (this.navigationBehavior === 0) {
        return null
      }
      return `/project/${this.slug}`
    },
    primaryCta () {
      if (this.navigationBehavior === 1) {
        return this.url
      }
      return null
    },
    imageAlt () {
      if (!this.enableImageAlt) {
        return null
      }
      return this.title
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-card {
  padding: 0 0.5rem 1rem;
  opacity: 0;
  animation: fadein 0.3s 1;
  animation-fill-mode: forwards;
  cursor: pointer;
  transition: width 0ms;
  &:hover {
    .title {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
    .thumbnail img {
      transform: scale(1.05);
    }
    .description {
      &[data-tooltip] {
        &:before,
        &:after {
          transition: 250ms ease-in;
          transform: translate(-50%, 0);
          opacity: 1;
        }
      }
    }
  }
  &:not(.list-view) {
    .content {
      margin-bottom: 2rem;
    }
  }
  &.list-view {
    .card-inner-wrapper {
      @include borderRadius_Medium;
      display: flex;
      flex-direction: row;
      background-color: #FFFFFF;
      height: 100%;
    }
    .thumbnail {
      width: 7rem;
      height: 7rem;
      margin-bottom: 0;
    }
    .content {
      padding: 1rem 1rem 1rem 0;
    }
  }
}

@keyframes fadein {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

.thumbnail {
  @include borderRadius_Medium;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10rem;
  background-color: #FFFFFF;
  margin-bottom: 1rem;
  img {
    max-width: 40%;
    max-height: 50%;
    width: auto;
    transition: 500ms ease-in-out;
  }
}

.content {
  flex: 1;
}

.title {
  @include fontSize_Medium;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-decoration: underline transparent;
  text-underline-offset: $underlineSpacing;
  transition: text-decoration-color 250ms ease-out;
}

.description {
  @include fontSize_Small;
  @include leading_Small;
  position: relative;
  &:hover {
    &[data-tooltip] {
      &:before,
      &:after {
        transform: translate(0, 0);
        opacity: 0;
      }
    }
  }
  &[data-tooltip] {
    &:before,
    &:after {
      z-index: 100;
    }
    &:after {
      width: 100%;
      white-space: normal;
      text-align: center;
    }
  }
}
</style>
