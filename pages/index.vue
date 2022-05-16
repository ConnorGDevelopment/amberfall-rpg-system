<template>
  <v-row justify="center" align="center">
    <v-col v-for="character in characterBank" :key="character.name" cols="2">
      <v-hover v-slot="{ hover }">
        <v-responsive aspect-ratio="1">
          <v-card
            :color="hover ? 'secondary' : 'grey darken-3'"
            height="100%"
            @click="selectCharacter(character)"
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
        </v-responsive>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ICharacter } from '~/model/character'
import { charStore } from '~/store'

@Component
export default class IndexPage extends Vue {
  get characterBank() {
    return charStore.characterBank
  }

  selectCharacter(character: ICharacter) {
    if (
      charStore.activeCharacter === null ||
      charStore.activeCharacter.name !== character.name
    ) {
      charStore.selectCharacter(character)
    }
    this.$router.push(`/${character.name}`)
  }
}
</script>
