# Generated by Django 4.2.9 on 2024-02-03 07:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("nav", "0002_remove_waypoint_active"),
    ]

    operations = [
        migrations.CreateModel(
            name="Port",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("port_id", models.CharField(max_length=3090)),
                ("latitude", models.FloatField()),
                ("longitude", models.FloatField()),
            ],
        ),
        migrations.AddField(
            model_name="waypoint",
            name="port_in",
            field=models.ManyToManyField(related_name="port_in", to="nav.port"),
        ),
        migrations.AddField(
            model_name="waypoint",
            name="port_out",
            field=models.ManyToManyField(related_name="port_out", to="nav.port"),
        ),
    ]
