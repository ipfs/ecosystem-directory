<template>
  <section id="accordion">

    <Accordion
      v-if="panels"
      v-slot="{ active }">
      <AccordionSection
        v-for="(panel, index) in panels"
        :key="index"
        :active="active"
        class="accordion-section">
        <AccordionHeader>
          <div class="accordion-header-content">
            {{ panel.name }}
          </div>
        </AccordionHeader>
        <AccordionContent>
          <div class="accordion-inner-content">
            {{ panel.content }}
          </div>
        </AccordionContent>
      </AccordionSection>
    </Accordion>

  </section>
</template>

<script>
// ===================================================================== Imports
import Accordion from '@/modules/zero/core/Components/Accordion/Accordion'
import AccordionHeader from '@/modules/zero/core/Components/Accordion/Header'
import AccordionSection from '@/modules/zero/core/Components/Accordion/Section'
import AccordionContent from '@/modules/zero/core/Components/Accordion/Content'

// ====================================================================== Export
export default {
  name: 'KitchenSinkAccordion',

  components: {
    Accordion,
    AccordionHeader,
    AccordionSection,
    AccordionContent
  },

  data () {
    return {
      panels: [
        { name: 'Panel 1', content: 'This is content from Panel 1' },
        { name: 'Panel 2', content: 'This is content from Panel 2' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
