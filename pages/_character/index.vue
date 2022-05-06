<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <v-col cols="auto">
              <v-avatar size="128">
                <v-img
                  :src="`/characters/${character.name}_Full.png`"
                  position="top center"
                />
              </v-avatar>
            </v-col>

            <v-col>
              <v-card-title class="text-h3 no-select">
                {{ character.name }} {{ character.surname }}
              </v-card-title>
              <v-card-subtitle>
                {{ character.race }} - {{ character.job.name }}
              </v-card-subtitle>
            </v-col>

            <v-col cols="auto">
              <v-card outlined>
                <v-card-subtitle class="text-center pb-0">
                  Tokens
                </v-card-subtitle>
                <v-card-title class="text-center py-0">
                  <v-btn small icon @click="character.triumph--">
                    <v-icon color="white"> mdi-minus-box </v-icon>
                  </v-btn>
                  <v-icon> mdi-weather-sunset </v-icon> :
                  {{ character.triumph }}
                  <v-btn small icon @click="character.triumph++">
                    <v-icon color="white"> mdi-plus-box </v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-title class="text-center py-0">
                  <v-btn small icon @click="character.adversity--">
                    <v-icon color="white"> mdi-minus-box </v-icon>
                  </v-btn>
                  <v-icon> mdi-weather-pouring </v-icon> :
                  {{ character.adversity }}
                  <v-btn small icon @click="character.adversity++">
                    <v-icon color="white"> mdi-plus-box </v-icon>
                  </v-btn>
                </v-card-title>
              </v-card>
            </v-col>

            <v-col cols="auto">
              <v-card outlined>
                <v-card-subtitle class="text-center pb-0"> HP </v-card-subtitle>
                <v-card-title class="justify-center py-0">
                  {{ character.currentHP }} / {{ character.maxHP }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <v-text-field
                    v-model="inputHP"
                    type="number"
                    hide-spin-buttons
                    hide-details
                    color="secondary"
                    dense
                    outlined
                    single-line
                    dark
                    prepend-icon="mdi-minus-box"
                    append-outer-icon="mdi-plus-box"
                    @click:prepend="
                      inputHP
                        ? character.changeHP(-inputHP)
                        : character.changeHP(-1)
                    "
                    @click:append-outer="
                      inputHP
                        ? character.changeHP(+inputHP)
                        : character.changeHP(1)
                    "
                    @focus="inputHP = null"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider />

        <v-card-text class="flex-row">
          <v-row no-gutters>
            <v-card outlined>
              <v-simple-table dark>
                <template #default>
                  <thead>
                    <tr>
                      <th>Stat</th>
                      <th>Current</th>
                      <th>1/2</th>
                      <th>Challenge Modifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stat, name) in character.stats" :key="name">
                      <td class="text-capitalize no-select">
                        <v-chip
                          label
                          :color="
                            statChips.find((chip) => chip.stat === name).color
                          "
                        >
                          {{ name }}
                        </v-chip>
                      </td>
                      <td>
                        <v-hover v-slot="{ hover }">
                          <v-btn :outlined="!hover" color="white">
                            <span v-if="!hover">
                              {{ stat }}
                            </span>
                            <v-icon v-else color="black">
                              mdi-dice-multiple
                            </v-icon>
                          </v-btn>
                        </v-hover>
                      </td>
                      <td>
                        <v-hover v-slot="{ hover }">
                          <v-btn :outlined="!hover" color="secondary">
                            <span v-if="!hover">
                              {{ character.halfStat(name) }}
                            </span>
                            <v-icon v-else color="white">
                              mdi-dice-multiple
                            </v-icon>
                          </v-btn>
                        </v-hover>
                      </td>
                      <td class="no-select">
                        {{ stat - 50 }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>

            <v-spacer />

            <v-card outlined>
              <v-card-title>
                <span class="pr-2"> Skills </span>
                <v-spacer />
                <v-chip
                  v-for="chip in statChips"
                  :key="chip.stat"
                  :class="chip.color"
                  class="text-capitalize mx-2"
                  :outlined="skillSearch !== chip.stat"
                  label
                  @click="
                    skillSearch !== chip.stat
                      ? (skillSearch = chip.stat)
                      : (skillSearch = '')
                  "
                >
                  {{ chip.stat }}
                </v-chip>
                <v-text-field
                  v-model="skillSearch"
                  append-icon="mdi-magnify"
                  hide-details
                  color="secondary"
                  dense
                  outlined
                  single-line
                  dark
                  @focus="skillSearch = ''"
                />
              </v-card-title>
              <v-data-table
                class="text-capitalize no-select"
                :headers="skillHeaders"
                :items="skills"
                :search="skillSearch"
              >
                <template #[`item.name`]="{ item }">
                  <v-row justify="space-between" align="center" no-gutters>
                    {{ item.name }}
                    <v-hover v-slot="{ hover }">
                      <v-btn
                        :outlined="!hover"
                        color="white"
                        width="2rem"
                        height="2rem"
                        min-width="0"
                      >
                        <v-icon :color="hover ? 'black' : 'white'">
                          mdi-dice-multiple
                        </v-icon>
                      </v-btn>
                    </v-hover>
                  </v-row>
                </template>
                <template #[`item.stat`]="{ item }">
                  <v-chip
                    label
                    :class="
                      statChips.find((chip) => chip.stat === item.stat).color
                    "
                    disabled
                    class="opacity-fix"
                  >
                    {{ item.stat }}
                  </v-chip>
                </template>
                <template #[`item.advanced`]="{ item }">
                  <v-chip
                    label
                    color="white"
                    text-color="black"
                    class="opacity-fix"
                    disabled
                  >
                    {{ item.advanced ? 'Advanced' : 'Basic' }}
                  </v-chip>
                </template>
                <template #[`item.proficient`]="{ item }">
                  <v-img
                    v-if="character.skills.includes(item.name)"
                    src="/Amber.png"
                    height="2em"
                    width="2em"
                    class="mx-auto"
                  />
                </template>
              </v-data-table>
            </v-card>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { charStore, skillStore } from '~/store'
import { Character } from '~/store/chars'

@Component
export default class CharacterPage extends Vue {
  genCharacter() {
    const characterData = charStore.character(this.$route.params.character)
    if (characterData) {
      return new Character(characterData)
    } else {
      return this.$nuxt.error({ statusCode: 404 })
    }
  }

  public character = this.genCharacter()
  public inputHP = null

  public skills = skillStore.skills

  public skillHeaders = [
    {
      text: 'Name',
      align: 'start',
      sortable: true,
      value: 'name',
    },
    {
      text: 'Stat',
      sortable: true,
      value: 'stat',
    },
    {
      text: 'Type',
      sortable: true,
      value: 'advanced',
    },
    {
      text: 'Proficient',
      value: 'proficient',
      align: 'center',
      sortable: false,
    },
  ]

  public skillSearch = ''

  public statChips = [
    {
      stat: 'strength',
      color: 'orange lighten-1',
    },
    {
      stat: 'dexterity',
      color: 'green lighten-1',
    },
    {
      stat: 'fortitude',
      color: 'brown lighten-1',
    },
    {
      stat: 'intelligence',
      color: 'light-blue lighten-1',
    },
    {
      stat: 'wisdom',
      color: 'deep-purple lighten-1',
    },
    {
      stat: 'charisma',
      color: 'pink lighten-1',
    },
  ]
}
</script>

<style scoped>
th {
  text-align: center !important;
}
td {
  text-align: center !important;
}
.no-select {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.opacity-fix {
  opacity: 1 !important;
}
</style>
