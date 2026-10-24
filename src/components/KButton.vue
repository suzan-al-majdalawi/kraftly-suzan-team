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
  color: #fff;
}

.k-button--secondary {
  background: #eef1ff;
  color: #2f54eb;
  border-color: #2f54eb;
}

.k-button--success {
  background: #067647;
  color: #fff;
}

.k-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
