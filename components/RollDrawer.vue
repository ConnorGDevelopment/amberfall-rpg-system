<template>
  <v-navigation-drawer
    v-model="drawer.show"
    absolute
    temporary
    class="transparent elevation-0"
    floating
    bottom
  >
    <v-row no-gutters align="end" style="height: 100%; width: 100%">
      <v-col cols="12">
        <v-card
          v-if="drawer.check"
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
              :style="drawer.clicked ? 'border-color: black !important;' : ''"
              :disabled="drawer.clicked"
              :outlined="drawer.clicked"
              @click="callToken('triumph', 'add')"
            >
              <v-icon
                :style="
                  drawer.clicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-plus-thick
              </v-icon>
              <v-icon
                :style="
                  drawer.clicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-trophy
              </v-icon>
            </v-btn>

            <v-btn
              v-if="drawer.clicked && drawer.check.triumph"
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
              :style="drawer.clicked ? 'border-color: black !important;' : ''"
              :disabled="drawer.clicked"
              :outlined="drawer.clicked"
              @click="callToken('ruin', 'add')"
            >
              <v-icon
                :style="
                  drawer.clicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-plus-thick
              </v-icon>
              <v-icon
                :style="
                  drawer.clicked
                    ? 'color: black !important;'
                    : ' color: white !important'
                "
              >
                mdi-trophy-broken
              </v-icon>
            </v-btn>

            <v-btn
              v-if="drawer.clicked && drawer.check.ruin"
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
import Check from '~/model/check'

@Component
export default class RollDrawer extends Vue {
  @Prop({ required: true }) drawer!: {
    show: boolean
    check: Check
    clicked: boolean
  }

  public misses: number = 15
  public speed: number = 60

  get resultText(): string {
    if (this.drawer.check.success && this.drawer.check.triumph) {
      return 'Triumphant Success!'
    } else if (this.drawer.check.success && !this.drawer.check.triumph) {
      return 'Success!'
    } else if (!this.drawer.check.success && !this.drawer.check.ruin) {
      return 'Failure!'
    } else if (!this.drawer.check.success && this.drawer.check.ruin) {
      return 'Ruinous Failure!'
    } else {
      return 'Error'
    }
  }

  callToken(
    tokenName: 'triumph' | 'ruin',
    operation: 'add' | 'subtract'
  ): void {
    this.$emit('callToken', { tokenName, operation })
  }
}
</script>

<style scoped>
.fade-in-text {
  animation: fadeIn linear 2s;
  -webkit-animation: fadeIn linear 2s;
  -moz-animation: fadeIn linear 2s;
  -o-animation: fadeIn linear 2s;
  -ms-animation: fadeIn linear 2s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
