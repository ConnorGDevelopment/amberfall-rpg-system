<template>
  <div :key="value">
    <v-btn small icon :disabled="isDisabled" @click="$emit('decrement')">
      <v-icon :color="iconColor"> mdi-minus-box </v-icon>
    </v-btn>
    <v-icon>
      {{ icon }}
    </v-icon>
    : {{ value }}
    <v-btn small icon @click="$emit('increment')">
      <v-icon :color="iconColor"> mdi-plus-box </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Incrementer extends Vue {
  @Prop({ required: true }) value!: number
  @Prop({ required: true }) icon!: string
  @Prop({ default: 'white' }) iconColor!: string
  @Prop({ default: false }) allowNegative!: boolean

  get isDisabled(): boolean {
    if (!this.allowNegative && this.value === 0) {
      return true
    } else {
      return false
    }
  }
}
</script>
