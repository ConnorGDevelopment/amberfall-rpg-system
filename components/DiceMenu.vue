<template>
  <v-menu
    v-model="menu.show"
    :position-x="menu.x"
    :position-y="menu.y"
    absolute
    offset-y
  >
    <v-list>
      <v-list-item @click="callRoll('advantage')">
        <v-list-item-content>
          <v-list-item-title> Advantage </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="callRoll('disadvantage')">
        <v-list-item-content>
          <v-list-item-title> Disadvantage </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Check from '~/model/check'
import StatBlock from '~/model/stat-block'

@Component
export default class DiceMenu extends Vue {
  @Prop({ required: true }) menu!: {
    show: boolean
    x: number
    y: number
    statName: keyof StatBlock
    statValue: number
  }

  callRoll(rollMethod: Check['rollMethod']) {
    this.$emit('callRoll', rollMethod)
  }
}
</script>
