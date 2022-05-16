<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card v-if="character">
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
                  <Incrementer
                    :value="character.triumph"
                    :icon="'mdi-trophy'"
                    @increment="changeToken('triumph', +1)"
                    @decrement="changeToken('triumph', -1)"
                  />
                </v-card-title>
                <v-card-title class="text-center pt-0">
                  <Incrementer
                    :value="character.ruin"
                    :icon="'mdi-trophy-broken'"
                    @increment="changeToken('ruin', +1)"
                    @decrement="changeToken('ruin', -1)"
                  />
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
                    :key="character.currentHP"
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
                    @click:prepend="inputHP ? changeHP(-inputHP) : changeHP(-1)"
                    @click:append-outer="
                      inputHP ? changeHP(+inputHP) : changeHP(1)
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
                    <tr
                      v-for="(stat, statName) in character.stats"
                      :key="statName"
                    >
                      <td class="text-capitalize no-select">
                        <StatChip :stat-name="statName" />
                      </td>
                      <td>
                        <DiceButton
                          :color="'white'"
                          :hover-color="'black'"
                          :stat="stat"
                          @callRoll="roll(statName, false, $event)"
                          @callMenu="openMenu(statName, false, $event)"
                        />
                      </td>
                      <td>
                        <DiceButton
                          :color="'secondary'"
                          :hover-color="'white'"
                          :stat="character.halfStat(statName)"
                          @callRoll="roll(statName, true, $event)"
                          @callMenu="openMenu(statName, true, $event)"
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
                <v-chip-group v-model="skillSearch">
                  <StatChip
                    v-for="(stat, statName) in character.stats"
                    :key="statName"
                    :stat-name="statName"
                    :outlined="skillSearch !== statName"
                    :is-disabled="false"
                  />
                </v-chip-group>
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
                <template #[`item.statName`]="{ item }">
                  <StatChip :stat-name="item.statName" />
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
import { parseCookies } from '~/store/char-store'

@Component({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (charStore.activeCharacter === null) {
        const cookie = parseCookies(document.cookie)
        if (
          cookie.activeCharacter &&
          charStore.character(cookie.activeCharacter)
        ) {
          // Build Character from Cookies
        } else {
          vm.$router.push('/')
        }
      } else if (charStore.activeCharacter.name !== to.params.character) {
        vm.$router.push('/')
      }
    })
  },
})
export default class CharacterPage extends Vue {
  get character() {
    if (charStore.activeCharacter) {
      return new Character(charStore.activeCharacter)
    }
  }

  get test() {
    return parseCookies(document.cookie)
  }

  changeHP(amount: number) {
    this.character!.changeHP(amount)
  }

  changeToken(tokenName: 'triumph' | 'ruin', amount: number) {
    this.character!.changeToken(tokenName, amount)
  }

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
      value: 'statName',
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

  openDrawer(statName: keyof StatBlock, isHalf: boolean, event: any) {
    if (this.character) {
      this.drawer = {
        show: true,
        statName,
        isHalf,
        method: event,
      }
    }
  }

  public drawer: {
    show: boolean
    statName: keyof StatBlock
    isHalf: boolean
    method: Check['rollMethod']
  } = {
    show: false,
    statName: 'strength',
    isHalf: false,
    method: 'flat',
  }

  closeDrawer() {
    this.drawer = {
      show: false,
      statName: 'strength',
      isHalf: false,
      method: 'flat',
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
