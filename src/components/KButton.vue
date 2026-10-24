<template>
  <button
    class="k-button"
    :class="`k-button--${variant}`"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary", "success"].includes(value),
  },
  type: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.k-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 10px 18px;
  font: inherit;
  font-size: 15px;
  cursor: pointer;
}

.k-button--primary {
  background: #2f54eb;
  color: #ffffff;
}

.k-button--secondary {
  background: #eef1ff;
  color: #243b9b;
  border-color: #243b9b;
}

.k-button--success {
  background: #067647;
  color: #ffffff;
}

.k-button:focus-visible {
  outline: 3px solid #111827;
  outline-offset: 3px;
}

.k-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
