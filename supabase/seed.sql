insert into public.restaurants(id,name) values ('00000000-0000-0000-0000-000000000001','SmartServe Demo Restaurant');
insert into public.categories(id,restaurant_id,name,name_ta,sort_order) values
('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Tiffin','டிபன்',1),
('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','Meals','சாப்பாடு',2),
('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','Biryani','பிரியாணி',3),
('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','Drinks','பானங்கள்',4),
('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000001','Desserts','இனிப்பு',5);
insert into public.tables(restaurant_id,table_number) select '00000000-0000-0000-0000-000000000001', generate_series(1,10);
insert into public.menu_items(restaurant_id,category_id,name,name_ta,description,description_ta,price,is_vegetarian,stock_quantity,is_special) values
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Masala Dosa','மசாலா தோசை','Crispy dosa with potato masala','உருளைக்கிழங்கு மசாலாவுடன் தோசை',90,true,35,true),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Idli','இட்லி','Soft steamed idli with sambar','சாம்பாருடன் மென்மையான இட்லி',50,true,40,false),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','South Indian Meals','தென்னிந்திய உணவு','Rice, sambar and sides','சாதம், சாம்பார் மற்றும் துணை உணவுகள்',150,true,20,false),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000003','Chicken Biryani','சிக்கன் பிரியாணி','Fragrant basmati rice with chicken','சிக்கனுடன் மணமுள்ள அரிசி',240,false,12,false),
('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000004','Filter Coffee','ஃபில்டர் காபி','Traditional South Indian coffee','பாரம்பரிய தென்னிந்திய காபி',40,true,50,true);
