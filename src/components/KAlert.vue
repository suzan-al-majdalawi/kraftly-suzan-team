<template>
  <div v-if="show" class="k-alert" :class="`k-alert--${variant}`" role="alert">
    {{ message }}
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
</script>

<style scoped>
.k-alert {
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
</style>
