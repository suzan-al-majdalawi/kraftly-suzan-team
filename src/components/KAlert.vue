<template>
  <div
    class="k-alert"
    :class="[`k-alert--${variant}`, { 'k-alert--visible': show }]"
    :role="variant === 'error' ? 'alert' : 'status'"
    aria-atomic="true"
  >
    <span v-if="show">{{ message }}</span>

    <button
      v-if="show"
      type="button"
      class="k-alert__close"
      aria-label="Stäng meddelandet"
      @click="$emit('close')"
    >
      ×
    </button>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: "info",
    validator: (value) => ["info", "success", "error"].includes(value),
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.k-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.k-alert--visible {
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 6px;
  font-size: 14px;
}

.k-alert--info {
  background: #eef1ff;
  color: #243b9b;
}

.k-alert--success {
  background: #dcfae6;
  color: #05603a;
}

.k-alert--error {
  background: #fee4e2;
  color: #912018;
}

.k-alert__close {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
}

.k-alert__close:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
</style>
