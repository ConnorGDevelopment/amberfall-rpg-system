<template>
  <v-navigation-drawer
    right
    app
    class="mx-auto"
    expand-on-hover
    :height="mini ? '80px' : '100%'"
    :mini-variant.sync="mini"
    mini-variant-width="80"
  >
    <v-list-item :class="mini ? 'px-4' : ''">
      <v-list-item-content>
        <v-list-item-title>
          <v-img
            :src="mini ? '/Amber.png' : '/Amberfall.png'"
            height="56"
            contain
          />
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider v-if="!mini" />
    <v-list v-if="!mini" dense nav>
      <v-list-item
        v-for="character in characters"
        :key="character.name"
        link
        :to="`/${character.name}`"
      >
        <v-list-item-avatar size="64">
          <v-img :src="`/characters/${character.name}.png`" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ character.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { charStore } from '~/store'

@Component
export default class Nav extends Vue {
  get characters() {
    return charStore.characters
  }

  public mini = true
}
</script>
