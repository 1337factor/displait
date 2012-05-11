from django.contrib import admin
import api


admin.site.register(api.models.Profile)
admin.site.register(api.models.Clock)
admin.site.register(api.models.Frame)
admin.site.register(api.models.ItemList)
admin.site.register(api.models.Item)
