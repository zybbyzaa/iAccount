<template>
  <div class="wrapper">
    <div class="task-header">
      <el-row>
        <el-col :span="16">
          <h3 class="title">
            收支记录
          </h3>
        </el-col>
        <el-col :span="4">
          <div class="btn-wrapper">
            <el-button size="small" icon="el-icon-plus" @click="switchAddRecordType">添加记录类别</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="btn-wrapper">
            <el-button size="small" icon="el-icon-plus" @click="switchAddRecordSubType">添加记录子类别</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="task-content">
      <div class="null-info" v-if="recordTypeLists.length === 0 && recordSubTypeLists.length === 0">
        请先添加记录类别
      </div>
      <div class="task-info" v-else>
        <!-- <el-collapse v-model="activeCollapse" @change="collapseChange">
          <el-collapse-item :title="taskType.doc.typeName" v-for="(taskType, index) in taskTypeLists" :key="index" :name="taskType.doc.typeName">
            <ul class="task-list">
              <li class="task-item tool-bar">
                <el-button size="mini" icon="el-icon-plus" type="primary" @click="switchAddTask(taskType.doc.typeName)">添加新任务</el-button>
              </li>
              <li class="task-item" v-for="(task, index) in taskItems[taskType.doc.typeName]" :key="index">
                <todo-task :task-doc="task.doc" @on-change="taskChange" @on-edit="taskEdit" @on-delete="taskDelete"></todo-task>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse> -->
      </div>
    </div>

    <!--  放置弹出窗口 -->
    <el-dialog title="添加记录类别" :visible.sync="recordTypeVisible">
      <el-form>
        <el-form-item label="记录类别" label-width="80">
          <el-input v-model="newRecordType" auto-complete="off" placeholder="请输入记录类别"></el-input>
        </el-form-item>
        <p class="info-warning">注意：记录类别添加后将无法修改</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="switchAddRecordType">取 消</el-button>
        <el-button type="primary" @click="addRecordType">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加记录子类别" :visible.sync="recordSubTypeVisible">
      <el-form>
        <el-form-item label="记录子类别" label-width="80">
          <el-input v-model="newRecordSubType" auto-complete="off" placeholder="请输入记录子类别"></el-input>
        </el-form-item>
        <el-form-item label="记录类别" label-width="80">
          <el-select v-model="newRecordType" placeholder="请选择记录类别">
            <el-option
              v-for="item in recordTypeLists"
              :key="item.id"
              :label="item.doc.typeName"
              :value="item.doc.typeName">
            </el-option>
          </el-select>
        </el-form-item>
        <p class="info-warning">注意：记录类别添加后将无法修改</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="switchAddRecordSubType">取 消</el-button>
        <el-button type="primary" @click="addRecordSubType">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加新任务" :visible.sync="taskVisible">
      <el-form>
        <el-form-item label="任务内容" label-width="80">
          <el-input v-model="newTask" auto-complete="off" placeholder="请输入新任务"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="switchAddTask">取 消</el-button>
        <el-button type="primary" @click="addTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PouchDB from "pouchdb";
var taskDB = new PouchDB("taskLists");
var typeDB = new PouchDB("recordTypes");
var subTypeDB = new PouchDB("recordSubTypes");

import TodoTask from "./TodoTask";
const uuidv4 = require('uuid/v4');

export default {
  name: "RecordList",
  components: {
    TodoTask
  },
  props: {},
  data() {
    return {
      recordTypeLists: [],
      recordTypeVisible: false,
      newRecordType: null,
      recordSubTypeLists: [],
      recordSubTypeVisible: false,
      newRecordSubType: null,
      taskVisible: false,
      newTask: null,
      activeTaskType: null,
      taskItems: {},
      activeCollapse: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    switchAddRecordType: function() {
      this.recordTypeVisible = !this.recordTypeVisible;
    },
    switchAddRecordSubType: function() {
      this.recordSubTypeVisible = !this.recordSubTypeVisible;
    },
    switchAddTask: function(taskType) {
      this.taskVisible = !this.taskVisible;
      this.activeTaskType = taskType;
      // console.log(this.activeTaskType);
    },
    collapseChange: function(activeNames) {
      sessionStorage.setItem("activeCollapse", JSON.stringify(activeNames));
    },
    addRecordType: function() {
      typeDB
        .get(this.newRecordType)
        .then(doc => {
          this.$message({
            message: "已经存在重复的记录类别了",
            type: "warning",
            duration: 1500,
            onClose: () => {
              this.newRecordType = null;
            }
          });
        })
        .catch(err => {
          typeDB
            .put({
              _id: uuidv4(),
              typeName: this.newRecordType
            })
            .then(res => {
              if (res.ok) {
                this.$message({
                  message: `新类别 ${this.newRecordType} 已经创建成功`,
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.$router.go(0);
                  }
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: "新建类别时出现错误",
                type: "error",
                duration: 1500
              });
            });
        });
    },
    addRecordSubType: function() {
      subTypeDB
        .get(this.newRecordSubType)
        .then(doc => {
          this.$message({
            message: "已经存在重复的记录类别了",
            type: "warning",
            duration: 1500,
            onClose: () => {
              this.newRecordSubType = null;
            }
          });
        })
        .catch(err => {
          subTypeDB
            .put({
              _id: uuidv4(),
              typeName: this.newRecordType,
              subTypeName: this.newRecordSubType
            })
            .then(res => {
              if (res.ok) {
                this.$message({
                  message: `新类别 ${this.newRecordSubType} 已经创建成功`,
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.$router.go(0);
                  }
                });
              }
            })
            .catch(err => {
              console.log(err);
              this.$message({
                message: "新建类别时出现错误",
                type: "error",
                duration: 1500
              });
            });
        });
    },
    addTask: function() {
      taskDB
        .put({
          _id: `${+new Date()}`,
          task: this.newTask,
          status: false,
          type: this.activeTaskType
        })
        .then(res => {
          if (res.ok) {
            this.$message({
              message: `${this.activeTaskType}分类下，新任务添加成功`,
              type: "success",
              duration: 1000,
              onClose: () => {
                this.$router.go(0);
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: "新建任务时出现错误",
            type: "error",
            duration: 1500
          });
        });
    },
    taskChange: function(taskDoc) {
      // console.log(taskInfo);
      taskDB
        .put(
          {
            _rev: taskDoc._rev,
            _id: taskDoc._id,
            task: taskDoc.task,
            status: taskDoc.status,
            type: taskDoc.type
          },
          { force: true }
        )
        .then(res => {})
        .catch(err => {
          console.log(err);
          this.$message({
            message: "新建任务时出现错误",
            type: "error",
            duration: 1500
          });
        });
    },
    taskEdit: function(taskDoc) {
      this.$prompt("编辑当前任务", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: taskDoc.task
      })
        .then(({ value }) => {
          taskDB
            .put(
              {
                _rev: taskDoc._rev,
                _id: taskDoc._id,
                task: value,
                status: taskDoc.status,
                type: taskDoc.type
              },
              { force: true }
            )
            .then(res => {
              this.$message({
                type: "success",
                message: "任务内容更新成功",
                duration: 1000,
                onClose: () => {
                  this.$router.go(0);
                }
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    taskDelete: function(taskDoc) {
      // console.log(taskDoc);
      this.$confirm("删除任务任务后将无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          taskDB
            .get(taskDoc._id)
            .then(doc => {
              console.log(doc);
              taskDB.remove(doc).then(() => {
                this.$router.go(0);
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    if (sessionStorage.getItem("activeCollapse")) {
      this.activeCollapse = JSON.parse(
        sessionStorage.getItem("activeCollapse")
      );
    }

    typeDB
      .allDocs({
        include_docs: true
      })
      .then(res => {
        console.log(res);
        this.recordTypeLists = res.rows;
      })
      .catch(err => {
        console.log(err);
        this.$message({
          message: "获取记录类型时出现错误",
          type: "error",
          duration: 1500
        });
      });

    subTypeDB
      .allDocs({
        include_docs: true
      })
      .then(res => {
        console.log(res);
        this.recordSubTypeLists = res.rows;
      })
      .catch(err => {
        console.log(err);
        this.$message({
          message: "获取记录子类型时出现错误",
          type: "error",
          duration: 1500
        });
      });

    taskDB
      .allDocs({
        include_docs: true
      })
      .then(res => {
        // console.log(res);
        res.rows.forEach(task => {
          if (!this.taskItems[task.doc.type]) {
            if (task.doc.type) {
              this.$set(this.taskItems, task.doc.type, [task]);
            }
          } else {
            this.taskItems[task.doc.type].push(task);
          }
        });
        // console.log(this.taskItems);
      })
      .catch(err => {
        console.log(err);
        this.$message({
          message: "获取任务时出现错误",
          type: "error",
          duration: 1500
        });
      });
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 90%;
  margin: 0 auto;

  .task-header {
    .btn-wrapper {
      margin-top: 1rem;
    }
  }

  .task-content {
    .null-info {
      margin-top: 2rem;
      text-align: center;
      font-weight: bold;
    }

    .task-info {
      width: 100%;
      .task-list {
        list-style: none;
        .task-item {
          width: 100%;
          padding: 0.5rem 0;
          border-bottom: 1px solid #ebeef5;
        }
      }
    }
  }

  .info-warning {
    color: #f56c6c;
  }
}
</style>