from django.core.cache import cache

CACHE_KEY = "all_users_cache"

def repopulate_users_to_cache():
    from auth_module.models import User  # moved import inside function to avoid circular import
    users = cache.get(CACHE_KEY)
    users = [
        {
            "id": f"{user.id_prefix}{user.id}",
            "email": user.email,
            "contact": user.contact1,
        }
        for user in User.objects.all()
    ]
    cache.set(CACHE_KEY, users, timeout=None)

def get_all_users_from_cache():
    from auth_module.models import User  # moved import inside function to avoid circular import
    users = cache.get(CACHE_KEY)
    if users is None:
        users = [
            {
                "id": f"{user.id_prefix}{user.id}",
                "email": user.email,
                "contact": user.contact1,
            }
            for user in User.objects.all()
        ]
        cache.set(CACHE_KEY, users, timeout=None)
    return users


def add_user_to_cache(user_instance):
    users = cache.get(CACHE_KEY)
    if users is not None:
        user_dict = {
            "id": f"{user_instance.id_prefix}{user_instance.id}",
            "contact": user_instance.contact1,
        }
        users.append(user_dict)
        cache.set(CACHE_KEY, users, timeout=None)


def cache_user_seaerch(serch_by, search_value):
    users = get_all_users_from_cache()
    users = [u for u in users if u[f"{serch_by}"] == search_value]
    return users