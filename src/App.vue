<template>
  <div class="container mx-auto">
    <div class="flex justify-center mt-4 gap-2">
      <input type="date" class="input input-bordered input-md w-full max-w-xs" v-model="date" />
      <input type="staff" placeholder="請輸入人員姓名?" class="input input-bordered input-md w-full max-w-xs" v-model="staff" />
      <button class="btn" @click="save" :disabled="isSave || staff === ''">
        <span class="loading loading-spinner loading-xs" v-if="isSave"></span>
        儲存
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>編號</th>
            <th>日期</th>
            <th>人員</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <th>{{ index + 1 }}</th>
            <td>
              <p v-if="!item.isEdit">{{ item.date }}</p>
            </td>
            <td>
              <p v-if="!item.isEdit">{{ item.staff }}</p>
              <input type="staff" placeholder="請輸入人員姓名?" class="input input-bordered input-md w-full max-w-xs" v-model="item.staff" v-else />
            </td>
            <td>
              <button class="btn btn-xs" @click="changeMode(index)" v-if="!item.isEdit">編輯</button>
              <div class="flex gap-2" v-if="item.isEdit">
                <button class="btn btn-success btn-outline btn-xs" @click="update(index)">更新</button>
                <button class="btn btn-success btn-outline btn-xs" @click="remove(index)">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Parse } from 'parse/dist/parse.min.js';

export default {
  setup() {
    const date = ref('');
    const staff = ref('');
    const items = ref([]);
    const isSave = ref(false);

    async function getData() {
      try {
        const query = new Parse.Query("Leave");
        let datas = await query.find();

        items.value = [];
        datas.forEach(data => {
          items.value.push({
            "id": data.id,
            "date": data.get('date'),
            "staff": data.get('staff'),
          })
        });
      }
      catch (error) {
        console.log(error);
      }
    }
    function changeMode(index) {
      items.value[index].isEdit = true;
    }
    async function update(index) {
      let item = items.value[index];
      try {
        const query = new Parse.Query("Leave");
        query.equalTo("objectId", item.id);
        const Leave = await query.first();
        Leave.set('staff', item.staff);
        await Leave.save()
        items.value[index].isEdit = false;
      }
      catch (error) {
        alert('更新失敗 ' + error.message);
      }
    }
    async function remove(index) {
      let item = items.value[index];
      try {
        const query = new Parse.Query("Leave");
        query.equalTo("objectId", item.id);
        const Leave = await query.first();
        await Leave.destroy();
        await getData();
      }
      catch (error) {
        console.log(error);
      }
    }
    async function save() {
      isSave.value = true;
      const leaveList = new Parse.Object("Leave");
      leaveList.set("date", date.value)
      leaveList.set("staff", staff.value);
      try {
        await leaveList.save()
        date.value = "";
        staff.value = "";
        await getData();
        isSave.value = false;
      }
      catch (error) {
        alert('上傳失敗 ' + error.message);
      }
    }

    onMounted(() => {
      getData();
    });

    return {
      staff, date, isSave, items,
      save, changeMode, update, remove,
    }
  },
}
</script>


<style>

</style>
