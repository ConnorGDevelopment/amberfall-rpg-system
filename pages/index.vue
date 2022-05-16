<template>
  <v-sheet>
    <v-slide-group>
      <v-slide-item
        v-for="character in characterBank"
        :key="character.data.name"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            :color="hover ? 'secondary' : 'grey darken-3'"
            :to="`/${character.data.name}`"
            class="ma-4"
          >
            <v-card-text class="justify-center text-center">
              <v-img
                :src="`/characters/${character.data.name}_Full.png`"
                contain
              />
            </v-card-text>
            <v-card-title class="justify-center text-center">
              {{ character.data.name }} {{ character.data.surname }}
            </v-card-title>
            <v-card-subtitle class="justify-center text-center">
              {{ character.data.race }} - {{ character.data.job.name }}
            </v-card-subtitle>
          </v-card>
        </v-hover>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class IndexPage extends Vue {
  async asyncData({ $axios }: Context) {
    const { ...characterBank } = await $axios
      .get('/.netlify/functions/get-characters')
      .then((response) => {
        return response.data.data
      })
    if (characterBank) {
      return {
        characterBank,
      }
    }
  }
}
</script>
