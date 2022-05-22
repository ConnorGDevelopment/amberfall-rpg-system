<template>
  <v-sheet>
    <v-slide-group>
      <v-slide-item v-for="character in characters" :key="character.name">
        <v-hover v-slot="{ hover }">
          <v-card
            :color="hover ? 'secondary' : 'grey darken-3'"
            :to="`/${character.name}`"
            class="ma-4"
          >
            <v-card-text class="justify-center text-center">
              <v-img :src="`/characters/${character.name}_Full.png`" contain />
            </v-card-text>
            <v-card-title class="justify-center text-center">
              {{ character.name }} {{ character.surname }}
            </v-card-title>
            <v-card-subtitle class="justify-center text-center">
              {{ character.race }} - {{ character.job.name }}
            </v-card-subtitle>
          </v-card>
        </v-hover>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Character } from '~/model/character'

@Component
export default class IndexPage extends Vue {
  get characters(): Character[] {
    return this.$store.getters.allCharacters
  }
}
</script>
