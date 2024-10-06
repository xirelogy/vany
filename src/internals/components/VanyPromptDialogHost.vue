<script setup lang="ts">
import {
  computed,
  ref,
  useSlots,
} from 'vue';

import {
  _used,
} from '@xirelogy/xwts';

import {
  type VanyPromptOptions,
  type VanyPromptButtonOption,
  VanyPromptOptionsDefault,
} from '../../service-components/VanyPromptService';

import VanyVue from '../../setup/VanyVue';

import VanyButton from '../../components/VanyButton.vue';
import VanyDialog from '../../components/VanyDialog.vue';
import VanyDiv from '../../components/VanyDiv.vue';
import VanyRenderFunctionComponent from '../../components/utils/VanyRenderFunctionComponent.vue';


const props = defineProps<{
  specOptions: VanyPromptOptions<any>,
}>();

const slots = useSlots();

const isShow = ref(false);

const buttonOptions = computed(() => {
  return props.specOptions.buttons ?? [
    {
      type: 'primary',
      value: props.specOptions.defaultReturn ?? VanyPromptOptionsDefault.defaultReturn,
      content: VanyPromptOptionsDefault.defaultButtonLabel,
    } as VanyPromptButtonOption<any>,
  ];
});


let currentReturn: any = null;
let currentResolve: (value: any) => void = () => { };


/**
 * Handle dialog closed
 */
function onDialogHidden() {
  currentResolve(currentReturn);
}


/**
 * Handle button clicked
 * @param buttonOption
 */
function onButtonClicked(buttonOption: VanyPromptButtonOption<any>) {
  currentReturn = buttonOption.value;
  isShow.value = false;
}


/**
 * Run the prompt's dialog
 */
function run(): Promise<any|null> {
  return new Promise((resolve, reject) => {
    // Reset variables
    currentReturn = null;
    currentResolve = resolve;

    // Show the dialog and wait
    isShow.value = true;
    _used(reject);
  });
}


defineExpose({
  run,
});
</script>

<template>
  <VanyDialog v-model="isShow" @hidden="onDialogHidden">
    <template v-if="slots.header" #header><slot name="header"></slot></template>
    <slot></slot>
    <template #footer>
      <VanyDiv inline>
        <VanyButton v-for="buttonOption in buttonOptions"
          :type="buttonOption.type"
          :light="buttonOption.light ?? false"
          @click="onButtonClicked(buttonOption)"
        >
          <VanyRenderFunctionComponent :fn="VanyVue.acceptFunctionOrTextAsFunction(buttonOption.content)"/>
        </VanyButton>
      </VanyDiv>
    </template>
  </VanyDialog>
</template>