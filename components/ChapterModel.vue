<template>
  <div>
    <b-modal v-model="showModal" title="Chi tiết chương">
      <img :src="chapterImage" class="img-fluid" alt="Chapter Image">
    </b-modal>
  </div>
</template>

<script>
export default {
  props: ['chapterImage', 'showModal']
};
</script>
