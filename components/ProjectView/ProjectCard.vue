<template>
    <div
      :class="`${format === 'list-view' ? 'col-3' : ''} card-container-${format}`">
      <NuxtLink :to="`project/${slug}`">

        <template v-if="(format === 'grid-view')">

          <div class="card-grid">
            <div class="card-logo-grid">
              <img :src="$relativity(`/images/logos/${logo}`)" />
            </div>
          </div>

          <p class="title">{{ title }}</p>

          <p class="description">{{ description }}</p>
        </template>

        <template v-if="(format === 'list-view')">
          <div class="card-list">

            <div class="card-logo-list">
              <img :src="$relativity(`/images/logos/${logo}`)" />
            </div>

            <div class="card-project-list">

              <p class="title">{{ title }}</p>

              <p class="description">{{ description }}</p>

            </div>

          </div>
        </template>

      </NuxtLink>
    </div>
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
      default: 'grid-view',
      required: false
    }
  },

  computed: {
    slug () {
      return this.$slugify(this.title)
    }
  }
}
</script>

<style lang="scss" scoped>
// //////////////////////////////////////////////////////////////////// [COMMON]
a {
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
}

.card-container-grid-view,
.card-project-list {
  .title {
    @include leading_Small;
    font-weight: 600;
    font-size: 15pt;
    font-family: $fontMontserrat;
    color: $tiber;
  }
  .description {
    @include leading_Small;
    color: $tundora;
    font-size: 10pt;
  }
}

// ///////////////////////////////////////////////////////////////// [GRID VIEW]
.card-container-grid-view {
  height: 250px;
  padding: 0 0.5rem 1rem;
  margin-bottom: 2rem;
  align-self: flex-start;
  flex: 1 1 25%;
  min-width: 220px;
  max-width: 300px;
}

.card-grid {
  width: 100%;
  height: 64%;
  @include borderRadius3;
  background-color: #FFFFFF;
  margin-bottom: 16px;
  &:hover {
    cursor: pointer;
  }
}

.card-logo-grid {
  position: relative;
  width: 50%;
  height: 60%;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
}

// ///////////////////////////////////////////////////////////////// [LIST VIEW]

.card-container-list-view {
  flex: 1 1 50%;
  min-width: 332px;
  height: 120px;
  margin-bottom: 0;
  padding-bottom: 0.75rem;
}

.card-list {
  width: 100%;
  height: 100%;
  @include borderRadius3;
  background-color: #FFFFFF;
  // margin-bottom: 16px;
  display: flex;
  position: relative;
  &:hover {
    cursor: pointer;
  }
}

.card-logo-list {
  position: relative;
  padding: 1.0rem;
  margin-left: 0.5rem;
  width: 80px;
  max-height: 80%;
  top: 50%;
  transform: translateY(-50%);

}

.card-project-list {
  position: absolute;
  vertical-align: middle;
  padding: 1rem;
  margin-left: 5.0rem;
  vertical-align: middle;
}

</style>
