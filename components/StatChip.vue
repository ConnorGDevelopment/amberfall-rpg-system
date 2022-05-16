<template>
  <v-chip
    label
    :color="statChips[statName]"
    :disabled="isDisabled"
    class="statChip"
    :outlined="outlined"
    :value="statName"
  >
    {{ statName }}
  </v-chip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import StatBlock from '~/model/stat-block'

@Component
export default class StatChip extends Vue {
  @Prop({ required: true }) statName!: keyof StatBlock
  @Prop({ default: false }) outlined!: boolean
  @Prop({ default: true }) isDisabled!: boolean

  public statChips = {
    strength: 'orange lighten-1',
    dexterity: 'green lighten-1',
    fortitude: 'brown lighten-1',
    intelligence: 'light-blue lighten-1',
    wisdom: 'deep-purple lighten-1',
    charisma: 'pink lighten-1',
  }
}
</script>

<style scoped>
.statChip {
  opacity: 1 !important;
  text-transform: capitalize !important;
}
</style>
