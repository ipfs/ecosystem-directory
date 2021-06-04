<template>
  <NuxtLink
    :to="`/project/${slug}`"
    :class="['project-card', format]">
    <div class="card-inner-wrapper">

      <div class="thumbnail">
        <img :src="$relativity(`/images/projects/${logo}`)" />
      </div>

      <div class="content">
        <p class="title">
          {{ title }}
        </p>
        <p class="description">
          {{ description }}
        </p>
      </div>

    </div>
  </NuxtLink>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ProjectCard',

  props: {
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
    format: {
      type: String,
      default: 'block-view',
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-card {
  padding: 0 0.5rem 1rem;
  transition: width 0ms;
  &.list-view {
    .card-inner-wrapper {
      @include borderRadius3;
      display: flex;
      flex-direction: row;
      background-color: #FFFFFF;
      height: 100%;
      min-width: 160px;
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

.title {
  @include fontSize_Large;
  font-weight: 600;
  font-family: $fontMontserrat;
  color: $tiber;
  margin-bottom: 0.25rem;
}

.description {
  @include fontSize_Small;
  @include leading_Small;
  color: $tundora;
}

.thumbnail {
  @include borderRadius3;
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
  }
}

.content {
  flex: 1;
}
</style>
