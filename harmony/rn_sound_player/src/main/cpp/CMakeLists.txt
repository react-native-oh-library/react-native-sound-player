cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(rnoh_sound_player_generated_dir "${CMAKE_CURRENT_SOURCE_DIR}/generated")
file(GLOB_RECURSE rnoh_sound_player_generated_SRC "${rnoh_sound_player_generated_dir}/**/*.cpp")
file(GLOB rnoh_sound_player_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_sound_player SHARED ${rnoh_sound_player_generated_SRC} ${rnoh_sound_player_SRC})
target_include_directories(rnoh_sound_player PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${rnoh_sound_player_generated_dir})
target_link_libraries(rnoh_sound_player PUBLIC rnoh)
