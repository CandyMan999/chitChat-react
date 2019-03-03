db = db.getMongo().getDB("chitchat");
print("dropping db " + db);
db.dropDatabase();
