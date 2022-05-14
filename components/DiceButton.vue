<template>
  <v-hover v-slot="{ hover }">
    <v-btn
      :outlined="!hover"
      :color="color"
      :height="height"
      :width="width"
      :min-width="minWidth"
      @contextmenu="callMenu"
      @click="callRoll('flat')"
    >
      <template v-if="!hover">
        <span v-if="stat">
          {{ stat }}
        </span>
        <v-icon v-else :color="color"> mdi-dice-multiple </v-icon>
      </template>
      <v-icon v-else :color="hoverColor"> mdi-dice-multiple </v-icon>
    </v-btn>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Check from '~/model/check'

@Component
export default class DiceButton extends Vue {
  @Prop({ default: 'white' }) color!: string
  @Prop({ default: 'black' }) hoverColor!: string
  @Prop({ default: null }) stat!: string | null
  @Prop({ default: undefined }) height!: string | number | null
  @Prop({ default: undefined }) width!: string | number | null
  @Prop({ default: undefined }) minWidth!: string | number | null

  callMenu(e: any) {
    e.preventDefault()
    this.$emit('callMenu', { x: e.clientX, y: e.clientY })
  }

  callRoll(rollMethod: Check['rollMethod']) {
    this.$emit('callRoll', rollMethod)
  }
}
</script>
