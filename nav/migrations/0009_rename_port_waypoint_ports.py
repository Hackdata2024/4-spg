# Generated by Django 4.2.9 on 2024-02-03 10:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("nav", "0008_remove_waypoint_port_in_remove_waypoint_port_out_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="waypoint",
            old_name="port",
            new_name="ports",
        ),
    ]
