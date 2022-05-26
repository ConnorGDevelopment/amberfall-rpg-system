<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-img src="/Amberfall.png" max-height="4rem" contain />
    </v-col>
    <v-col v-for="card in cards" :key="card.to" cols="3">
      <v-hover v-slot="{ hover }">
        <v-card
          :to="card.to"
          :color="hover ? 'secondary' : 'primary'"
          class="ma-4"
        >
          <v-card-text>
            <v-img :src="card.img" contain />
          </v-card-text>
          <v-card-title
            class="text-h3 justify-center text-center"
            style="font-family: Old English MT !important"
          >
            {{ card.title }}
          </v-card-title>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class IndexPage extends Vue {
  public cards: {
    to: string
    img: string
    title: string
  }[] = [
    {
      to: '/characters',
      img: '/icons/human-handsdown.svg',
      title: 'Characters',
    },
    {
      to: '/rulebook',
      img: '/icons/book-outline.svg',
      title: 'Rulebook',
    },
    {
      to: '/lore',
      img: '/icons/feather.svg',
      title: 'Lore',
    },
    {
      to: '/map',
      img: '/icons/map-outline.svg',
      title: 'Map',
    },
  ]
}
</script>
