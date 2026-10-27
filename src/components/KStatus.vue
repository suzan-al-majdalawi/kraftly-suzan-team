<template>
  <span
    class="status-chip"
    :class="{
      'status-betald': status === 'Betald',
      'status-obetald': status === 'Obetald',
      'status-forfallen': status === 'Förfallen',
      'status-okand': !['Betald', 'Obetald', 'Förfallen'].includes(status),
    }"
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
  color: #243b9b;
  background: #eef1ff;
}

.status-forfallen {
  color: #912018;
  background: #fee4e2;
}

.status-okand {
  color: #344054;
  background: #f2f4f7;
}
</style>
