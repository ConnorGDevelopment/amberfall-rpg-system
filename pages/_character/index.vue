<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <!-- Avatar -->
            <v-col cols="auto">
              <v-avatar size="128">
                <v-img
                  :src="`/characters/${character.name}_Full.png`"
                  position="top center"
                />
              </v-avatar>
            </v-col>

            <!-- Name -->
            <v-col>
              <v-card-title class="text-h3 no-select">
                {{ character.name }} {{ character.surname }}
              </v-card-title>
              <v-card-subtitle>
                {{ character.race }} - {{ character.job.name }}
              </v-card-subtitle>
            </v-col>

            <!-- Tokens -->
            <v-col cols="auto">
              <v-card outlined class="mr-4">
                <v-card-subtitle class="text-center pb-0">
                  Tokens
                </v-card-subtitle>
                <v-card-title class="text-center py-0">
                  <v-btn
                    small
                    icon
                    :disabled="character.triumph === 0"
                    @click="character.triumph--"
                  >
                    <v-icon color="white"> mdi-minus-box </v-icon>
                  </v-btn>
                  <v-icon> mdi-trophy </v-icon> :
                  {{ character.triumph }}
                  <v-btn small icon @click="character.triumph++">
                    <v-icon color="white"> mdi-plus-box </v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-title class="text-center pt-0">
                  <v-btn
                    small
                    icon
                    :disabled="character.ruin === 0"
                    @click="character.ruin--"
                  >
                    <v-icon color="white"> mdi-minus-box </v-icon>
                  </v-btn>
                  <v-icon> mdi-trophy-broken </v-icon> :
                  {{ character.ruin }}
                  <v-btn small icon @click="character.ruin++">
                    <v-icon color="white"> mdi-plus-box </v-icon>
                  </v-btn>
                </v-card-title>
              </v-card>
            </v-col>

            <!-- HP -->
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
            <!-- Stats -->
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
                          disabled
                          class="opacity-fix"
                        >
                          {{ name }}
                        </v-chip>
                      </td>
                      <td>
                        <DiceButton
                          :color="'white'"
                          :hover-color="'black'"
                          :stat="stat"
                          @callRoll="roll(name, false, $event)"
                          @callMenu="openMenu(name, false, $event)"
                        />
                      </td>
                      <td>
                        <DiceButton
                          :color="'secondary'"
                          :hover-color="'white'"
                          :stat="character.halfStat(name)"
                          @callRoll="roll(name, true, $event)"
                          @callMenu="openMenu(name, true, $event)"
                        />
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

            <!-- Skills -->
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
                    <DiceButton
                      :color="'white'"
                      :hover-color="'black'"
                      :width="'2rem'"
                      :height="'2rem'"
                      :min-width="0"
                      @callRoll="
                        roll(
                          item.stat,
                          !character.proficiency.includes(item.name),
                          $event
                        )
                      "
                      @callMenu="
                        openMenu(
                          item.stat,
                          !character.proficiency.includes(item.name),
                          $event
                        )
                      "
                    />
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
                    v-if="character.proficiency.includes(item.name)"
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

    <DiceMenu
      :menu="menu"
      @callRoll="roll(menu.statName, menu.isHalf, $event)"
    />

    <RollDrawer
      :drawer="drawer"
      @callToken="changeToken($event)"
      @closeDrawer="closeDrawer"
    />
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { charStore, skillStore } from '~/store'
import { Character } from '~/model/character'
import StatBlock from '~/model/stat-block'
import Check from '~/model/check'

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

  public menu = {
    show: false,
    x: 0,
    y: 0,
    statName: '',
    isHalf: false,
  }

  openMenu(statName: keyof StatBlock, isHalf: boolean, event: any) {
    this.$nextTick(() => {
      this.menu = {
        show: true,
        x: event.x,
        y: event.y,
        statName,
        isHalf,
      }
    })
  }

  roll(statName: keyof StatBlock, isHalf: boolean, event: any) {
    if (this.character) {
      this.drawer = {
        show: true,
        check: this.character.statCheck(statName, isHalf, event),
        clicked: false,
      }
    }
  }

  public drawer: {
    show: boolean
    check: null | Check
    clicked: boolean
  } = {
    show: false,
    check: null,
    clicked: false,
  }

  closeDrawer() {
    this.drawer = {
      show: false,
      check: null,
      clicked: false,
    }
  }

  changeToken(event: {
    tokenName: 'triumph' | 'ruin'
    operation: 'add' | 'subtract'
  }) {
    if (event.tokenName === 'triumph' && this.character) {
      if (event.operation === 'add') {
        this.character.triumph++
        this.drawer.clicked = true
      } else if (event.operation === 'subtract') {
        this.character.triumph--
        this.drawer.clicked = false
      }
    } else if (event.tokenName === 'ruin' && this.character) {
      if (event.operation === 'add') {
        this.character.ruin++
        this.drawer.clicked = true
      } else if (event.operation) {
        this.character.ruin--
        this.drawer.clicked = false
      }
    }
  }
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
