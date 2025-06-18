const listService = {
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
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "order" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('list', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI fields for compatibility
      return (response.data || []).map(list => ({
        Id: list.Id,
        name: list.Name || '',
        color: list.color || '#5B47E0',
        icon: list.icon || 'List',
        order: list.order || 0,
        Name: list.Name || '',
        Tags: list.Tags || '',
        Owner: list.Owner || null
      }));
    } catch (error) {
      console.error("Error fetching lists:", error);
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
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "order" } }
        ]
      };

      const response = await apperClient.getRecordById('list', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Map database fields to UI fields for compatibility
      const list = response.data;
      return {
        Id: list.Id,
        name: list.Name || '',
        color: list.color || '#5B47E0',
        icon: list.icon || 'List',
        order: list.order || 0,
        Name: list.Name || '',
        Tags: list.Tags || '',
        Owner: list.Owner || null
      };
    } catch (error) {
      console.error(`Error fetching list with ID ${id}:`, error);
      return null;
    }
  },

  async create(listData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields and include only updateable fields
      const dbList = {
        Name: listData.name || '',
        color: listData.color || '#5B47E0',
        icon: listData.icon || 'List',
        order: listData.order || 0
      };

      const params = {
        records: [dbList]
      };

      const response = await apperClient.createRecord('list', params);
      
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
          const list = successfulRecords[0].data;
          // Map back to UI format
          return {
            Id: list.Id,
            name: list.Name || '',
            color: list.color || '#5B47E0',
            icon: list.icon || 'List',
            order: list.order || 0,
            Name: list.Name || '',
            Tags: list.Tags || '',
            Owner: list.Owner || null
          };
        }
      }

      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating list:", error);
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
      if (updates.name !== undefined) {
        dbUpdates.Name = updates.name;
      }
      if (updates.color !== undefined) {
        dbUpdates.color = updates.color;
      }
      if (updates.icon !== undefined) {
        dbUpdates.icon = updates.icon;
      }
      if (updates.order !== undefined) {
        dbUpdates.order = updates.order;
      }

      const params = {
        records: [dbUpdates]
      };

      const response = await apperClient.updateRecord('list', params);
      
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
          const list = successfulRecords[0].data;
          // Map back to UI format
          return {
            Id: list.Id,
            name: list.Name || '',
            color: list.color || '#5B47E0',
            icon: list.icon || 'List',
            order: list.order || 0,
            Name: list.Name || '',
            Tags: list.Tags || '',
            Owner: list.Owner || null
          };
        }
      }

      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating list:", error);
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

      const response = await apperClient.deleteRecord('list', params);
      
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
      console.error("Error deleting list:", error);
      throw error;
    }
  }
};

export default listService;