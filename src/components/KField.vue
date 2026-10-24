<template>
  <div class="k-field">
    <label :for="inputId" class="k-field__label">
      {{ label }}
    </label>

    <input
      :id="inputId"
      v-model="model"
      v-bind="$attrs"
      class="k-field__input"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    />

    <p v-if="hint" :id="hintId" class="k-field__hint">
      {{ hint }}
    </p>

    <p v-if="error" :id="errorId" class="k-field__error">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, useId } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
});

const model = defineModel({
  type: String,
  default: "",
});

const autoId = useId();

const inputId = computed(() => props.id || `k-field-${autoId}`);

const hintId = computed(() => `${inputId.value}-hint`);

const errorId = computed(() => `${inputId.value}-error`);

const describedBy = computed(() => {
  const ids = [
    props.hint ? hintId.value : "",
    props.error ? errorId.value : "",
  ].filter(Boolean);

  return ids.length ? ids.join(" ") : undefined;
});
</script>

<style scoped>
.k-field {
  margin-bottom: 12px;
}

.k-field__label {
  display: block;
  font-size: 13px;
  color: #4a5468;
  margin-bottom: 4px;
}

.k-field__input {
  margin-bottom: 0;
}

.k-field__input[aria-invalid="true"] {
  border-color: #d92d20;
}

.k-field__hint {
  color: #5c6679;
  font-size: 12px;
  margin-top: 4px;
}

.k-field__error {
  color: #b42318;
  font-size: 13px;
  margin-top: 4px;
}
</style>
