let images = ["https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500","https://www.wbs.ac.uk/wbs2012/assets/File/cat%20for%20suzy%20tobias%20story.jpg", "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg?resize=750px:*", "https://i.insider.com/55a67a9b371d22472c8b463c?width=300&format=jpeg&auto=webp", "https://sites.google.com/site/wwwfeliuscatuscom/_/rsrc/1459381996272/cats-background/cute_cat_hd_backgrounds_u220k_wallniku.jpg?height=224&width=400"];
let index = 0;

function previous()
{
  let image = document.querySelector("#cats");
  let pageNum = document.querySelector("#pageNum")
  index = index-1;
  if(index == -1)
  {
    index = 4;
  }
  image.setAttribute("src", images[index]);
  pageNum.innerText = "Image "+(index+1)+"/5";
}

function next()
{
  let image = document.querySelector("#cats");
  let pageNum = document.querySelector("#pageNum")
  index = index+1;
  if(index == 5)
  {
    index = 0;
  }
  image.setAttribute("src", images[index]);
  pageNum.innerText = "Image "+(index+1)+"/5";
}
