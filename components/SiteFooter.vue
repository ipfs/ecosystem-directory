<template>
  <footer v-if="pageData" id="site-footer">

    <section class="panel-top">
      <div class="grid-spaceBetween-noGutter">

        <div class="col-6_sm-12">
          <h2 class="heading">
            {{ pageData.heading }}
          </h2>
          <div class="subheading" v-html="pageData.subheading"></div>
        </div>

        <div class="col-5_sm-12">
          <div class="mailchimp-form" v-html="pageData.mailchimp_form"></div>
        </div>

      </div>
    </section>

    <section class="panel-bottom">
      <div class="grid-spaceBetween-noGutter">

        <div v-if="navigation" class="col-7_sm-12">
          <nav id="footer-navigation">
            <component
              :is="link.type"
              v-for="(link, index) in navigation.footer"
              :key="index"
              :to="link.disabled ? '' : link.href"
              :href="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :target="link.target"
              class="navigation-link onhover-opacity">
              {{ link.label }}
            </component>
          </nav>
        </div>

        <div class="col-4_sm-12">
          <SocialIcons />
        </div>

        <div class="col-12">
          <div class="copyright" v-html="pageData.copyright"></div>
        </div>

      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SocialIcons from '@/components/SocialIcons'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    SocialIcons
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      navigation: 'global/navigation'
    }),
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('general')) {
        return siteContent.general.footer_content
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  padding: 4rem 0;
  background: linear-gradient(180deg, #041727 0, #062B3F);
  color: white;
  @include small {
    padding: 2rem 0;
  }
}

::v-deep .subheading,
::v-deep .copyright {
  a {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.panel-top {
  margin-bottom: 4rem;
  @include small {
    margin-bottom: 1rem;
  }
}

.heading {
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: -0.01rem;
}

.subheading {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

::v-deep #mailchimp-form {
  margin-top: 0.5rem;
  @include small {
    margin-top: 1rem;
  }
  .panel-top {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
    @include mini {
      flex-direction: column;
      margin-bottom: 0.5rem;
    }
  }
  .panel-bottom {
    span {
      padding-left: 0.25rem;
    }
  }
  input {
    &[type="email"],
    &[type="submit"] {
      @include borderRadius_Medium;
    }
    &[type="email"] {
      flex: 1;
      background-color: white;
      padding: 0.5rem;
      line-height: 1.5;
      color: black;
    }
    &[type="submit"] {
      padding: 0 0.75rem;
      margin-left: 1rem;
      font-weight: 600;
      transition: 250ms ease-out;
      @include mini {
        line-height: 1.5;
        padding: 0.5rem;
        margin-left: 0;
        margin-top: 0.5rem;
      }
      &:hover {
        transition: 250ms ease-in;
        background-color: #66989A;
      }
    }
  }
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
#footer-navigation {
  margin-bottom: 2rem;
  @include small {
    margin-bottom: 0;
  }
  @include mini {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
  }
}

.navigation-link {
  color: white;
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}

.social-icons-container {
  @include small {
    margin: 2rem 0;
  }
}

::v-deep .copyright {
  @include fontSize_Small;
  svg {
    display: inline-block;
    vertical-align: middle;
    width: 1rem;
    margin-right: 0.25rem;
  }
}
</style>
