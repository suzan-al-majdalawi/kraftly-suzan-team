<template>
  <span
    class="status-chip"
    :class="status === 'Betald' ? 'status-betald' : 'status-obetald'"
  >
    {{ status }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.status-chip {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.status-betald {
  color: #05603a;
  background: #dcfae6;
}

.status-obetald {
  color: #912018;
  background: #fee4e2;
}
</style>
