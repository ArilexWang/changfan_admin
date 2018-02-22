<template>
	<section>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="别墅名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="searchVillaByKey">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="villas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="别墅名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="id" label="ID" width="120" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" min-width="180" sortable>
			</el-table-column>

			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleComment(scope.$index,scope.row)">查看评论</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>

				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getVillaByKey, getVillaInfoById, getAllVillas } from '../../api/api';
import CityInfo from '../../common/js/city-data'
import base_image_url from '../../common/js/base_url'
import Form from './Form'

export default {
	data() {
		return {
			filters: {
				name: ''
			},
			components: {
				Form
			},
			users: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列

			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},
			//编辑界面数据
			editForm: {
				id: 0,
				name: '',
				sex: -1,
				age: 0,
				birth: '',
				addr: ''
			},

			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {
				name: '',
				sex: -1,
				age: 0,
				birth: '',
				addr: ''
			},
			main_banners: [],
			postData: {
				token: '93L43E91oA1cbC9k40ZK2eSeOCqxxjJz1SsL4NGv:NcyOYv94e0gg883xh7O_JfPhIlM=:eyJzY29wZSI6IjUxYmllc2h1IiwiZGVhZGxpbmUiOjE1MTc1MjU2ODl9'
			},
			previewImageUrl: '',
			dialogVisible: false,
			villas: []

		}
	},
	methods: {
		//性别显示转换
		formatSex: function(row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//获取用户列表
		getUsers() {
			let para = {
				page: this.page,
				name: this.filters.name
			};
			this.listLoading = true;
			//NProgress.start();
			getUserListPage(para).then((res) => {
				this.total = res.data.total;
				this.users = res.data.users;
				this.listLoading = false;
				//NProgress.done();
			});
		},
		getVillas() {
			this.listLoading = true;
			getAllVillas().then(function(res) {
				console.log(res.data);
				that.villas = res.data
				this.listLoading = false;
			}).catch(function(res) {
				console.log(res)
			})
		},

		searchVillaByKey() {
			let para = {
				name: this.filters.name
			};
			console.log(para)
			// this.listLoading = true
			getVillaByKey(para).then(function(res) {
				console.log(res);
			}).catch(function(res) {
				console.log(res)
			})

		},
		//预览图片
		handlePictureCardPreview(file) {
			this.previewImageUrl = file.url;
			this.dialogVisible = true;
		},
		//上传成功
		handleBannerSuccess(res) {
			var imgurl = base_image_url + res.key
			var dic = {}
			dic.url = imgurl
			this.main_banners.push(dic)
		},
		handleBannerRemove(file, fileList) {
			var index = this.main_banners.indexOf(file)
			this.main_banners.splice(index, 1)
		},

		//删除
		handleDel: function(index, row) {
			this.listLoading = true;
			let para = { id: this.villas[index].id };
			console.log(para)
			this.$http.post("http://118.25.6.157:8686/homeparty/manage/deleteVillaById", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
				this.listLoading = false;
				console.log(response)
				this.getVillas()
			}).catch(function(error) {
				console.log(error)
			})
		},
		//显示编辑界面
		handleEdit: function(index, row) {
			console.log(this.villas[index].id)
			var _id = this.villas[index].id
			this.$router.push({ name: '新建', path: '/form', params: { id: _id }  })
		},
		//显示新增界面
		handleAdd: function() {
			this.$router.push({ name: '新建', path: '/form' })
		},
		handleComment: function(index, row) {
			var _id = this.villas[index].id
			this.$router.push({ name: '评论', path: '/comment', params: { id: _id } })
		},
		//编辑
		editSubmit: function() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.editForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						editUser(para).then((res) => {
							this.editLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getUsers();
						});
					});
				}
			});
		},
		//新增
		addSubmit: function() {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.addForm);
						para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						addUser(para).then((res) => {
							this.addLoading = false;
							//NProgress.done();
							this.$message({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getUsers();
						});
					});
				}
			});
		},
		selsChange: function(sels) {
			this.sels = sels;
		},
		//批量删除
		batchRemove: function() {
			var ids = this.sels.map(item => item.id).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { ids: ids };
				batchRemoveUser(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getUsers();
				});
			}).catch(() => {

			});
		}
	},

	mounted() {
		var para = {}
		this.getUsers();
		var that = this
		getAllVillas().then(function(res) {
			console.log(res.data);
			that.villas = res.data

		}).catch(function(res) {
			console.log(res)
		})
	}
}

</script>

<style scoped>

</style>