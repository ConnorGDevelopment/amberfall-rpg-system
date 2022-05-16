<template>
  <v-navigation-drawer
    v-model="drawer.show"
    absolute
    temporary
    class="transparent elevation-0"
    floating
    bottom
    width="312"
  >
    <v-row no-gutters align="start" style="height: 100%; width: 100%">
      <v-col cols="12">
        <v-card color="white" class="elevation-4">
          <v-card-title class="black--text justify-center">
            Challenge Modifier
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4" align-self="center">
                <v-btn
                  v-for="value in [-10, -20, -30]"
                  :key="value"
                  color="black"
                  class="white--text my-2"
                  block
                >
                  {{ value }}
                </v-btn>
              </v-col>
              <v-col cols="4" align-self="center">
                <v-btn
                  color="black"
                  class="white--text my-2"
                  style="text-transform: none"
                  block
                >
                  0
                </v-btn>
              </v-col>
              <v-col cols="4" align-self="center">
                <v-btn
                  v-for="value in [10, 20, 30]"
                  :key="value"
                  color="black"
                  class="white--text my-2"
                  block
                >
                  +{{ value }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card
          v-if="drawer.check && drawer.challengeClicked"
          :key="drawer.check.value"
          color="white"
          class="elevation-4"
        >
          <v-row no-gutters>
            <v-btn icon class="ml-auto" @click="$emit('closeDrawer')">
              <v-icon color="black"> mdi-close</v-icon>
            </v-btn>
          </v-row>
          <v-card-title class="d-flex flex-column black--text pt-0">
            <span class="fade-in-text">
              {{ resultText }}
            </span>
            <span class="d-flex flex-row">
              <ScrollText
                v-for="(digit, index) in drawer.check.value
                  .toString()
                  .split('')"
                :key="index"
                :misses="misses"
                :speed="speed"
                >{{ digit }}</ScrollText
              >
            </span>
          </v-card-title>
          <v-card-text class="justify-center text-center">
            <v-btn
              v-if="drawer.check.triumph"
              class="fade-in-text"
              color="black"
              :style="
                drawer.tokenClicked ? 'border-color: black !important;' : ''
              "
              :disabled="drawer.tokenClicked"
              :outlined="drawer.tokenClicked"
              @click="callToken('triumph', 'add')"
            >
              <v-icon
                :style="
                  drawer.tokenClicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-plus-thick
              </v-icon>
              <v-icon
                :style="
                  drawer.tokenClicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-trophy
              </v-icon>
            </v-btn>

            <v-btn
              v-if="drawer.tokenClicked && drawer.check.triumph"
              color="black"
              min-width="0"
              width="2rem"
              height="2rem"
              @click="callToken('triumph', 'subtract')"
            >
              <v-icon color="white"> mdi-arrow-u-left-top-bold </v-icon>
            </v-btn>

            <v-btn
              v-if="drawer.check.ruin"
              class="fade-in-text"
              color="black"
              :style="
                drawer.tokenClicked ? 'border-color: black !important;' : ''
              "
              :disabled="drawer.tokenClicked"
              :outlined="drawer.tokenClicked"
              @click="callToken('ruin', 'add')"
            >
              <v-icon
                :style="
                  drawer.tokenClicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-plus-thick
              </v-icon>
              <v-icon
                :style="
                  drawer.tokenClicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-trophy-broken
              </v-icon>
            </v-btn>

            <v-btn
              v-if="drawer.tokenClicked && drawer.check.ruin"
              color="black"
              min-width="0"
              width="2rem"
              height="2rem"
              @click="callToken('ruin', 'subtract')"
            >
              <v-icon color="white"> mdi-arrow-u-left-top-bold </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import StatBlock from '~/model/stat-block'

@Component
export default class RollDrawer extends Vue {
  @Prop({ required: true }) drawer!: {
    show: boolean
    statName: keyof StatBlock
  }

  public misses: number = 15
  public speed: number = 60

  callToken(
    tokenName: 'triumph' | 'ruin',
    operation: 'add' | 'subtract'
  ): void {
    this.$emit('callToken', { tokenName, operation })
  }

  roll() {}
}
</script>
