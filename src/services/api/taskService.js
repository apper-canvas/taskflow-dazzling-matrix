const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } },
          { field: { Name: "list_id" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI fields for compatibility
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        listId: task.list_id?.Id || task.list_id || 'default',
        createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
        order: task.order || 0,
        Name: task.Name || task.title || '',
        Tags: task.Tags || '',
        Owner: task.Owner || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } },
          { field: { Name: "list_id" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Map database fields to UI fields for compatibility
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        listId: task.list_id?.Id || task.list_id || 'default',
        createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
        order: task.order || 0,
        Name: task.Name || task.title || '',
        Tags: task.Tags || '',
        Owner: task.Owner || null
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async getByListId(listId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } },
          { field: { Name: "list_id" } }
        ],
        where: [
          {
            FieldName: "list_id",
            Operator: "EqualTo",
            Values: [parseInt(listId, 10)]
          }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI fields for compatibility
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        listId: task.list_id?.Id || task.list_id || 'default',
        createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
        order: task.order || 0,
        Name: task.Name || task.title || '',
        Tags: task.Tags || '',
        Owner: task.Owner || null
      }));
    } catch (error) {
      console.error("Error fetching tasks by list ID:", error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields and include only updateable fields
      const dbTask = {
        Name: taskData.title || taskData.Name || '',
        title: taskData.title || '',
        completed: false,
        priority: taskData.priority || 'medium',
        due_date: taskData.dueDate || null,
        created_at: new Date().toISOString(),
        order: taskData.order || 0,
        list_id: parseInt(taskData.listId, 10) || null
      };

      const params = {
        records: [dbTask]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          // Map back to UI format
          return {
            Id: task.Id,
            title: task.title || task.Name || '',
            completed: task.completed || false,
            priority: task.priority || 'medium',
            dueDate: task.due_date || null,
            listId: task.list_id?.Id || task.list_id || 'default',
            createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
            order: task.order || 0,
            Name: task.Name || task.title || '',
            Tags: task.Tags || '',
            Owner: task.Owner || null
          };
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields and include only updateable fields
      const dbUpdates = {
        Id: parseInt(id, 10)
      };

      // Only include updateable fields that are provided
      if (updates.title !== undefined) {
        dbUpdates.Name = updates.title;
        dbUpdates.title = updates.title;
      }
      if (updates.completed !== undefined) {
        dbUpdates.completed = updates.completed;
      }
      if (updates.priority !== undefined) {
        dbUpdates.priority = updates.priority;
      }
      if (updates.dueDate !== undefined) {
        dbUpdates.due_date = updates.dueDate;
      }
      if (updates.order !== undefined) {
        dbUpdates.order = updates.order;
      }
      if (updates.listId !== undefined) {
        dbUpdates.list_id = parseInt(updates.listId, 10);
      }

      const params = {
        records: [dbUpdates]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          // Map back to UI format
          return {
            Id: task.Id,
            title: task.title || task.Name || '',
            completed: task.completed || false,
            priority: task.priority || 'medium',
            dueDate: task.due_date || null,
            listId: task.list_id?.Id || task.list_id || 'default',
            createdAt: task.created_at || task.CreatedOn || new Date().toISOString(),
            order: task.order || 0,
            Name: task.Name || task.title || '',
            Tags: task.Tags || '',
            Owner: task.Owner || null
          };
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async reorder(taskId, newOrder, newListId) {
    try {
      // For reordering, we'll update the specific task and potentially its list
      const updates = {
        order: newOrder
      };

      if (newListId) {
        updates.listId = newListId;
      }

      const updatedTask = await this.update(taskId, updates);
      
      // Return the updated task (simplified compared to mock version)
      return [updatedTask];
    } catch (error) {
      console.error("Error reordering task:", error);
      throw error;
    }
  }
};

export default taskService;